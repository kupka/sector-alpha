import { Matrix } from "mathjs";
import { Asteroid } from "../archetypes/asteroid";
import { AsteroidField } from "../archetypes/asteroidField";
import { Facility } from "../archetypes/facility";
import { NegativeQuantity } from "../errors";
import { TransactionInput } from "./trade";

export interface MoveOrder {
  type: "move";
  position: Matrix;
}

export interface TradeOrder {
  type: "trade";
  offer: TransactionInput;
  target: Facility;
}

export interface MineOrder {
  type: "mine";
  target: AsteroidField;
  targetRock: Asteroid;
}

export interface HoldPositionOrder {
  type: "hold";
}

export type Order = MoveOrder | TradeOrder | MineOrder | HoldPositionOrder;

export function tradeOrder(order: Omit<TradeOrder, "type">): TradeOrder | null {
  if (order.offer.quantity <= 0) {
    throw new NegativeQuantity(order.offer.quantity);
  }

  return {
    ...order,
    type: "trade",
  };
}

export function mineOrder(order: Omit<MineOrder, "type">): MineOrder | null {
  return {
    ...order,
    type: "mine",
  };
}

export class Orders {
  value: Order[] = [];
}
