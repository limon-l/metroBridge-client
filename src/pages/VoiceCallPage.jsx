import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useToast } from "../hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMicrophone,
  faMicrophoneSlash,
  faPhoneSlash,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

export default function VoiceCallPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const participant = location.state?.participant || null;
  const conversation = location.state?.conversation || null;
  const role = location.pathname.split("/")[1] || "student";
  const messagesPath = `/${role}/messages`;
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState("Ready to connect");
  const [isStarting, setIsStarting] = useState(false);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const bars = useMemo(() => [18, 34, 26, 44, 20, 38, 24, 42, 28, 36], []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCall = async () => {
    setIsStarting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Voice calling is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsConnected(true);
      setStatus("Connected");
      setDuration(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      showToast("Voice call started.", "success");
    } catch (error) {
      showToast(error?.message || "Unable to start voice call.", "error");
      setStatus("Microphone permission required");
    } finally {
      setIsStarting(false);
    }
  };

  const endCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsConnected(false);
    setIsMuted(false);
    setDuration(0);
    setStatus("Call ended");
    navigate(messagesPath, {
      state: conversation?.id
        ? { openConversationId: conversation.id }
        : undefined,
    });
  };

  const toggleMute = () => {
    if (!streamRef.current) return;

    const nextMuted = !isMuted;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !nextMuted;
    });
    setIsMuted(nextMuted);
    setStatus(nextMuted ? "Microphone muted" : "Microphone active");
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-r from-slate-950 via-primary-dark to-primary text-white shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-white/70">
              Voice call studio
            </p>
            <h2 className="mt-2 text-white">Private voice room</h2>
            <p className="mt-2 max-w-2xl text-white/85">
              Start a focused voice session with your conversation partner using
              a clean, professional call surface.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wide text-white/70">
              Session
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {participant?.name || "Selected participant"}
            </p>
            <p className="text-xs text-white/70">{status}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-6 border-border/80 bg-slate-50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-primary">Live voice session</h3>
              <p className="text-small text-neutral">
                {conversation?.lastMessage ||
                  "Keep the discussion moving with voice."}
              </p>
            </div>
            <Badge variant={isConnected ? "success" : "accent"}>
              {isConnected
                ? `Connected ${formatDuration(duration)}`
                : "Offline"}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-950 via-primary-dark to-slate-900 p-6 text-white shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 text-4xl font-semibold">
                  {(participant?.name || "U").charAt(0).toUpperCase()}
                </div>
                <h3 className="mt-4 text-white">
                  {participant?.name || "Waiting for participant"}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  {isConnected ? "Speaking now" : "Start the call to connect"}
                </p>

                <div className="mt-8 flex items-end justify-center gap-2">
                  {bars.map((height, index) => (
                    <span
                      key={index}
                      className="call-wave rounded-full bg-white/70"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${index * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-border bg-white p-4 shadow-soft">
              <p className="text-small font-semibold uppercase tracking-wide text-primary">
                Call controls
              </p>
              <div className="space-y-2 text-small text-neutral">
                <p>
                  Microphone, mute, and session timing controls are active here.
                </p>
                <p>
                  {conversation
                    ? "Linked conversation ready."
                    : "Open from messages to join a thread."}
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={startCall}
                  disabled={isStarting || isConnected}
                  variant="primary">
                  <FontAwesomeIcon icon={faMicrophone} />
                  {isStarting ? "Starting..." : "Start voice call"}
                </Button>
                <Button
                  className="w-full"
                  onClick={toggleMute}
                  disabled={!isConnected}
                  variant="secondary">
                  <FontAwesomeIcon
                    icon={isMuted ? faMicrophoneSlash : faVolumeHigh}
                  />
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button className="w-full" onClick={endCall} variant="danger">
                  <FontAwesomeIcon icon={faPhoneSlash} />
                  End call
                </Button>
                <Button
                  className="w-full"
                  onClick={() => navigate(messagesPath)}
                  variant="secondary">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back to messages
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 border-border/80 bg-white shadow-soft">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-primary">
              Session details
            </p>
            <h3 className="mt-2">Call summary</h3>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">
                Participant
              </p>
              <p className="mt-1 font-medium text-text">
                {participant?.name || "No participant selected"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">
                Role
              </p>
              <p className="mt-1 font-medium text-text">
                {participant?.role || "Conversation contact"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">
                Topic
              </p>
              <p className="mt-1 font-medium text-text">
                {conversation?.lastMessage || "General discussion"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral">
                Status
              </p>
              <p className="mt-1 font-medium text-emerald-600">{status}</p>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        .call-wave {
          width: 10px;
          animation: pulseWave 1s ease-in-out infinite;
        }

        @keyframes pulseWave {
          0%, 100% { transform: scaleY(0.7); opacity: 0.45; }
          50% { transform: scaleY(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
