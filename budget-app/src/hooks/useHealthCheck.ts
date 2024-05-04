import axios from "axios";
import { useEffect } from "react";
import { useInterval } from "usehooks-ts";

export interface HealthCheckOptions {
  /**
   * URL to check for health
   *
   * @default "/api/health"
   */
  url?: string;
  /**
   * Timeout for health check
   *
   * @default 1000
   */
  timeout?: number;
  /**
   * Interval for checking health
   *
   * @default 3000
   */
  interval?: number;
  onSuccess?: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
}

export function useHealthCheck(options: HealthCheckOptions) {
  const healthCheckPath = options.url ?? "/api/health";
  const timeout = options.timeout ?? 1000;
  const interval = options.interval ?? 3000;

  const checkHealth = async (): Promise<boolean> => {
    try {
      await axios.get(healthCheckPath, {
        timeout,
      });
      return true;
    } catch (error) {
      console.error("Health check failed", error);
      return false;
    }
  };

  const startHealthCheck = async () => {
    const isHealthy = await checkHealth();
    // console.log("Checking health, isHealthy:", isHealthy);
    if (isHealthy) {
      if (options.onSuccess) {
        options.onSuccess();
      }
      return;
    } else {
      if (options.onError) {
        options.onError();
      }
    }
  };

  useInterval(startHealthCheck, interval);

  useEffect(() => {
    startHealthCheck();
  }, []);

  return;
}