import { toast } from "@/lib/toast";

// Milestone celebration — confetti + a toast when a title is finished.
export async function celebrate(name: string) {
  toast(`You finished ${name} 🎉`);
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 130,
      spread: 74,
      startVelocity: 42,
      origin: { y: 0.35 },
      scalar: 0.9,
      colors: ["#E0A960", "#c0956a", "#f0d6ad", "#ffffff"]
    });
  } catch {
    // confetti is best-effort
  }
}
