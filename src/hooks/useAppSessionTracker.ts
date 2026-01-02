import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useTrackSessionTimeMutation } from "@/src/services/UserRequest/userApi";

export const useAppSessionTracker = () => {
  const appState = useRef(AppState.currentState);
  const sessionStartTime = useRef<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [trackSessionTime] = useTrackSessionTimeMutation();

  // Function to track current session time
  const trackCurrentSession = async () => {
    if (sessionStartTime.current && AppState.currentState === "active") {
      console.log("trackCurrentSession called inside if");
      const duration =
        (new Date().getTime() - sessionStartTime.current.getTime()) /
        (1000 * 60); // Convert to minutes

      // Track if duration is meaningful (more than 0.1 minutes = 6 seconds)
      if (duration > 0.1) {
        try {
          await trackSessionTime({
            duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
            sessionType: "app_open",
          }).unwrap();
          // Reset start time after tracking
          sessionStartTime.current = new Date();
        } catch (error) {
          console.log("Error tracking session time:", error);
        }
      }
    }
  };

  useEffect(() => {
    // Track initial app open when component mounts
    if (AppState.currentState === "active") {
      sessionStartTime.current = new Date();
      // Start periodic tracking every 5 minutes while app is active
      intervalRef.current = setInterval(
        () => {
          trackCurrentSession();
        },
        5 * 60 * 1000
      ); // 5 minutes in milliseconds
    }

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // App has come to the foreground
          sessionStartTime.current = new Date();

          // Start periodic tracking
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = setInterval(
            () => {
              trackCurrentSession();
            },
            5 * 60 * 1000
          ); // 5 minutes
        } else if (
          appState.current === "active" &&
          nextAppState.match(/inactive|background/)
        ) {
          // App has gone to the background - track current session
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          if (sessionStartTime.current) {
            const duration =
              (new Date().getTime() - sessionStartTime.current.getTime()) /
              (1000 * 60); // Convert to minutes

            // Track if duration is meaningful
            if (duration > 0.1) {
              trackSessionTime({
                duration: Math.round(duration * 100) / 100,
                sessionType: "app_open",
              }).catch((error) => {
                console.log(
                  "Error tracking session time on background:",
                  error
                );
              });
            }
            sessionStartTime.current = null;
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      // Cleanup: track final session and clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (sessionStartTime.current && AppState.currentState === "active") {
        const duration =
          (new Date().getTime() - sessionStartTime.current.getTime()) /
          (1000 * 60);
        if (duration > 0.1) {
          trackSessionTime({
            duration: Math.round(duration * 100) / 100,
            sessionType: "app_open",
          }).catch((error) => {
            console.log("Error tracking final session:", error);
          });
        }
      }
      subscription.remove();
    };
  }, [trackSessionTime]);
};
