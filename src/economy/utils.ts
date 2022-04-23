import every from "lodash/every";
import { Matrix, norm, subtract, sum } from "mathjs";
import sortBy from "lodash/sortBy";
import minBy from "lodash/minBy";
import { map } from "lodash";
import { Facility } from "./factility";
import { sim } from "../sim";
import { Asteroid, AsteroidField } from "./field";
import { FacilityModule } from "./facilityModule";
import { perCommodity } from "../utils/perCommodity";
import { Commodity } from "./commodity";
import { Entity } from "../components/entity";

export function getFacilityWithMostProfit(
  facility: Facility,
  commodity: Commodity
): Facility | null {
  const distance = (f) =>
    norm(subtract(facility.position, f.position) as Matrix) as number;

  const profit = (f: Facility) =>
    facility.components.owner.value === f.components.owner.value
      ? 1e20
      : (facility.components.trade.offers[commodity].price -
          f.components.trade.offers[commodity].price) *
        (facility.components.trade.offers[commodity].type === "buy" ? 1 : -1);

  const sortedByProfit = sortBy(
    sim.facilities
      .filter(
        (f) =>
          f.components.trade.offers[commodity].type !==
            facility.components.trade.offers[commodity].type &&
          f.components.trade.offers[commodity].quantity > 0
      )
      .map((f) => ({
        facility: f,
        profit: profit(f),
      })),
    "profit"
  ).reverse();

  if (!sortedByProfit[0] || sortedByProfit[0].profit <= 0) {
    return null;
  }

  return sortBy(
    sortedByProfit
      .filter((f, _, arr) => f.profit / arr[0].profit >= 0.95)
      .map((f) => f.facility),
    distance
  ).reverse()[0];
}

export function getClosestMineableAsteroid(
  field: AsteroidField,
  position: Matrix
): Asteroid {
  return minBy(
    field.asteroids.filter((r) => !r.mined),
    (r) => norm(subtract(position, r.position) as Matrix)
  );
}

export function createIsAbleToProduce(
  facility: Facility
  // eslint-disable-next-line no-unused-vars
): (facilityModule: FacilityModule) => boolean {
  return (facilityModule: FacilityModule) =>
    every(
      perCommodity(
        (commodity) =>
          facility.storage.hasSufficientStorage(
            commodity,
            facilityModule.productionAndConsumption[commodity].consumes
          ) &&
          (facilityModule.productionAndConsumption[commodity].produces
            ? facility.storage.getAvailableWares()[commodity] <
              facility.getQuota(commodity)
            : true)
      )
    );
}

/**
 *
 * @returns Minimum required money to fulfill all buy requests, not taking
 * into account sell offers
 */
export function getPlannedBudget(entity: Entity): number {
  return sum(
    map(entity.components.trade.offers).map(
      (offer) => (offer.type === "sell" ? 0 : offer.quantity) * offer.price
    )
  );
}
