import { createSector, sectorSize } from "@core/archetypes/sector";
import { add, random } from "mathjs";
import type { PositionAxial } from "@core/components/hecsPosition";
import { axialToCube, hecsToCartesian } from "@core/components/hecsPosition";
import type { AiType } from "@core/components/ai";
import { requestShip } from "@core/systems/ai/shipPlanning";
import { facilityModules } from "@core/archetypes/facilityModule";
import { changeRelations } from "@core/components/relations";
import settings from "@core/settings";
import type { Position2D } from "@core/components/position";
import { createFaction } from "../archetypes/faction";
import { createShip } from "../archetypes/ship";
import { changeBudgetMoney, createBudget } from "../components/budget";
import type { MineableCommodity } from "../economy/commodity";
import type { Sim } from "../sim";
import { pickRandom } from "../utils/generators";
import { spawnAsteroidField } from "./asteroids";
import { shipClasses } from "./ships";
import { createLink } from "./teleporters";
import mapData from "./data/map.json";
import { populateSectors } from "./factions";

export function getFixedWorld(sim: Sim): Promise<void> {
  const sectors = mapData.sectors.map((data) =>
    createSector(sim, {
      ...data,
      position: axialToCube(data.position as PositionAxial),
    })
  );
  const getSector = (id: string) =>
    sectors[mapData.sectors.findIndex((sector) => sector.id === id)];
  mapData.links.forEach((link) => {
    const s1 = getSector(link.sectors[0]);
    const s2 = getSector(link.sectors[1]);

    if (!s1 || !s2) {
      return;
    }

    const [telA, telB] = createLink(
      sim,
      [s1, s2],
      // link.position
      undefined
    );

    if (link.draw) {
      telA.cp.teleport.draw = link.draw[0] as "horizontal" | "vertical";
      telB.cp.teleport.draw = link.draw[1] as "horizontal" | "vertical";
    }
  });

  mapData.sectors.forEach((sector) =>
    Object.entries(sector.resources)
      .filter(([, size]) => size > 0)
      .forEach(([mineable, size]) => {
        spawnAsteroidField(
          sim,
          mineable as MineableCommodity,
          size,
          getSector(sector.id)
        );
      })
  );

  mapData.factions.forEach((factionData) => {
    const faction = createFaction(factionData.name, sim);
    faction.cp.name.slug = factionData.slug;
    changeBudgetMoney(faction.cp.budget, 1e10);
    faction.addComponent({
      name: "ai",
      type: factionData.type as AiType,
      stockpiling: random(1.2, 1.6),
      priceModifier: random(0.1, 0.25),
      patrols: factionData.patrols!,
      restrictions: factionData.restrictions!,
      home: factionData.home ? getSector(factionData.home).id : 0,
    });
    faction.cp.color.value = factionData.color;
    faction.cp.blueprints.ships = shipClasses.filter((s) =>
      factionData.blueprints.ships.includes(s.slug)
    );
    faction.cp.blueprints.facilityModules = Object.values(
      facilityModules
    ).filter((m) => factionData.blueprints.facilityModules.includes(m.slug));
    populateSectors(sim, factionData.sectors.map(getSector), faction);

    if (factionData.type === "travelling") {
      for (let index = 0; index < Math.random() * 10; index++) {
        requestShip(
          faction,
          pickRandom(sim.queries.shipyards.get()),
          "transport",
          false
        );
      }
    }
  });

  mapData.relations.forEach((relation) => {
    const [factionA, factionB] = (relation.factions as [string, string]).map(
      (slug) => sim.queries.ai.get().find((f) => f.cp.name.slug === slug)
    );
    changeRelations(factionA!, factionB!, relation.value);
  });

  const player = sim.queries.ai.get().find((f) => f.cp.name.slug === "PLA")!;
  player.addTag("player");
  player.removeComponent("ai").removeComponent("budget");
  player.addComponent(createBudget());
  player.addComponent({
    name: "missions",
    value: [],
    offer: null,
    declined: settings.bootTime,
  });
  player.addTag("player");
  changeBudgetMoney(player.cp.budget, 5000);
  const startingSector = getSector("sector-alpha");

  const playerShip = createShip(sim, {
    ...pickRandom(shipClasses.filter(({ slug }) => slug === "courierA")),
    angle: random(-Math.PI, Math.PI),
    position: add(
      hecsToCartesian(startingSector.cp.hecsPosition.value, sectorSize / 10),
      [random(-1, 1), random(-1, 1)]
    ) as Position2D,
    owner: player,
    sector: startingSector,
  });
  playerShip.cp.autoOrder!.default = { type: "hold" };

  const playerMiningShip = createShip(sim, {
    ...shipClasses.find(({ slug }) => slug === "smallMinerA")!,
    angle: random(-Math.PI, Math.PI),
    position: add(
      hecsToCartesian(startingSector.cp.hecsPosition.value, sectorSize / 10),
      [random(-1, 1), random(-1, 1)]
    ) as Position2D,
    owner: player,
    sector: startingSector,
  });
  playerMiningShip.cp.autoOrder!.default = { type: "hold" };

  const builderShip = createShip(sim, {
    ...pickRandom(shipClasses.filter(({ role }) => role === "building")),
    angle: random(-Math.PI, Math.PI),
    position: add(
      hecsToCartesian(startingSector.cp.hecsPosition.value, sectorSize / 10),
      [random(-1, 1), random(-1, 1)]
    ) as Position2D,
    owner: player,
    sector: startingSector,
  });
  builderShip.cp.autoOrder!.default = { type: "hold" };

  const storageShip = createShip(sim, {
    ...pickRandom(shipClasses.filter(({ role }) => role === "storage")),
    angle: random(-Math.PI, Math.PI),
    position: add(
      hecsToCartesian(startingSector.cp.hecsPosition.value, sectorSize / 10),
      [random(-1, 1), random(-1, 1)]
    ) as Position2D,
    owner: player,
    sector: startingSector,
  });
  storageShip.cp.autoOrder!.default = { type: "hold" };

  return Promise.resolve();
}

export default getFixedWorld;
