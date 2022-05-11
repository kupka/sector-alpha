import { TradeOrder } from "../../components/orders";
import { RequireComponent } from "../../tsHelpers";
import { acceptTrade } from "../../utils/trading";

export function tradeOrder(
  entity: RequireComponent<"drive" | "storage">,
  order: TradeOrder
): boolean {
  entity.cp.drive.setTarget(order.target);

  if (entity.cp.drive.targetReached) {
    if (order.offer.type === "sell") {
      order.target.cp.storage.allocationManager.release(
        order.offer.allocations.buyer.storage
      );

      entity.cp.storage.transfer(
        order.offer.commodity,
        order.offer.quantity,
        order.target.cp.storage,
        true
      );
    } else {
      order.target.cp.storage.allocationManager.release(
        order.offer.allocations.seller.storage
      );
      order.target.cp.storage.transfer(
        order.offer.commodity,
        order.offer.quantity,
        entity.cp.storage,
        true
      );
    }

    acceptTrade(order.target, order.offer);
    return true;
  }

  return false;
}
