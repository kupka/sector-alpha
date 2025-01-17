import type { Camera } from "./camera";
import type { Budget } from "./budget";
import type { Owner } from "./owner";
import type { Trade } from "./trade";
import type { CommodityStorage, SimpleCommodityStorage } from "./storage";
import type { Position } from "./position";
import type { CompoundProduction, Production } from "./production";
import type { Parent } from "./parent";
import type { StorageBonus } from "./storageBonus";
import type { Modules } from "./modules";
import type { Name } from "./name";
import type { SelectionManager } from "./selection";
import type { Render } from "./render";
import type { RenderGraphics } from "./renderGraphics";
import type { AutoOrder } from "./autoOrder";
import type { Drive } from "./drive";
import type { Mining } from "./mining";
import type { Minable } from "./minable";
import type { AsteroidSpawn } from "./asteroidSpawn";
import type { Children } from "./children";
import type { Orders } from "./orders";
import type { HECSPosition } from "./hecsPosition";
import type { Teleport } from "./teleport";
import type { Docks, Dockable } from "./dockable";
import type { Commander } from "./commander";
import type { Color } from "./color";
import type { Ai } from "./ai";
import type { SectorStats } from "./sectorStats";
import type { SystemManager } from "./systemManager";
import type { InflationStats } from "./inflationStats";
import type { Shipyard } from "./shipyard";
import type { Blueprints } from "./blueprints";
import type { Journal } from "./journal";
import type { Deployable } from "./deployable";
import type { FacilityModuleQueue } from "./facilityModuleQueue";
import type { Builder } from "./builder";
import type { Relations } from "./relations";
import type { HitPoints } from "./hitpoints";
import type { Damage } from "./damage";
import type { Model } from "./model";
import type { Disposable } from "./disposable";
import type { Subordinates } from "./subordinates";
import type { CreationDate } from "./creationDate";
import type { Missions } from "./missions";

export interface CoreComponents {
  ai: Ai;
  asteroidSpawn: AsteroidSpawn;
  autoOrder: AutoOrder;
  blueprints: Blueprints;
  budget: Budget;
  builder: Builder;
  camera: Camera;
  children: Children;
  color: Color;
  commander: Commander;
  compoundProduction: CompoundProduction;
  creationDate: CreationDate;
  damage: Damage;
  deployable: Deployable;
  disposable: Disposable;
  dockable: Dockable;
  docks: Docks;
  drive: Drive;
  facilityModuleQueue: FacilityModuleQueue;
  hecsPosition: HECSPosition;
  hitpoints: HitPoints;
  inflationStats: InflationStats;
  journal: Journal;
  minable: Minable;
  mining: Mining;
  missions: Missions;
  model: Model;
  modules: Modules;
  name: Name;
  orders: Orders;
  owner: Owner;
  parent: Parent;
  position: Position;
  production: Production;
  relations: Relations;
  render: Render;
  renderGraphics: RenderGraphics<any>;
  sectorStats: SectorStats;
  selectionManager: SelectionManager;
  shipyard: Shipyard;
  simpleCommodityStorage: SimpleCommodityStorage;
  storage: CommodityStorage;
  storageBonus: StorageBonus;
  subordinates: Subordinates;
  systemManager: SystemManager;
  teleport: Teleport;
  trade: Trade;
}

/**
 * Base interface for any component. Due to serialization and deserialization
 * problems it's required for a component to be composed only of literal
 * (not class) objects.
 */
export type BaseComponent<T extends string> = { name: T };
