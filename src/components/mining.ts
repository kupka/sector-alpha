import { asteroid, Asteroid } from "../archetypes/asteroid";
import { Sim } from "../sim";
import { Cooldowns } from "../utils/cooldowns";

export class Mining {
  /**
   * Mined commodity per second
   */
  efficiency: number;

  /**
   * Storage is limited to non-fraction quantities so we're buffering it and
   * move to storage every 2 seconds
   */
  buffer: number = 0;

  asteroid: Asteroid | null = null;
  asteroidId: number | null = null;
  cooldowns: Cooldowns<"mine">;

  constructor(efficiency: number) {
    this.efficiency = efficiency;
    this.cooldowns = new Cooldowns("mine");
  }

  load = (sim: Sim) => {
    if (this.asteroidId) {
      this.asteroid = asteroid(
        sim.entities.find((e) => e.id === this.asteroidId)
      );
    }
  };

  setAsteroid = (entity: Asteroid) => {
    this.asteroid = asteroid(entity);
    this.asteroidId = entity.id;
  };

  clearAsteroid = () => {
    this.asteroid = null;
    this.asteroidId = null;
  };
}
