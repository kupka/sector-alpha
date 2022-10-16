import { RequireComponent } from "../tsHelpers";
import { BaseComponent } from "./component";

export type Target = RequireComponent<"position">;

export interface ShipDriveProps {
  /**
   * Expressed in percent of max speed per second
   */
  acceleration: number;
  maneuver: number;
  cruise: number;
  /**
   * Expressed in degrees per second
   */
  rotary: number;
  /**
   * Time to initiate cruise engine
   */
  ttc: number;
}

export interface Drive extends BaseComponent<"drive"> {
  /**
   * Expressed in percent of max speed per second
   */
  acceleration: number;
  currentSpeed: number;
  maneuver: number;
  cruise: number;
  /**
   * Expressed in radians per second
   */
  rotary: number;
  /**
   * Time to initiate cruise engine
   */
  ttc: number;

  state: "maneuver" | "warming" | "cruise";
  target: number | null;
  targetReached: boolean;
}

export function createDrive(input: ShipDriveProps): Drive {
  return {
    ...input,
    currentSpeed: 0,
    rotary: (input.rotary * Math.PI) / 180,
    state: "maneuver",
    target: null,
    targetReached: false,
    name: "drive",
  };
}

export function startCruise(drive: Drive) {
  drive.state = "warming";
}

export function stopCruise(drive: Drive) {
  drive.currentSpeed = drive.maneuver;
  drive.state = "maneuver";
}

export function setTarget(drive: Drive, target: number | null) {
  const shouldUpdate = target === null ? true : target !== drive.target;

  if (shouldUpdate) {
    drive.state = "maneuver";
    drive.target = target;
    drive.targetReached = false;
  }
}

export function clearTarget(drive: Drive) {
  setTarget(drive, null);
  drive.targetReached = true;
}