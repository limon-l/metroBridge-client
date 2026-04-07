import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarCheck,
  faComment,
  faEnvelope,
  faFileLines,
  faHeart,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import {
  connectMessageSocket,
  getMessageSocket,
} from "../../services/socketClient";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  normalizeNotification,
} from "../../services/notificationService";

const typeConfig = {
  post_comment: {
    icon: faComment,
    label: "Comment",
  },
  post_reaction: {
    icon: faHeart,
    label: "Reaction",
  },
  message: {
    icon: faEnvelope,
    label: "Message",
  },
  appointment_created: {
    icon: faCalendarCheck,
    label: "Appointment",
  },
  appointment_status_changed: {
    icon: faCalendarCheck,
    label: "Appointment",
  },
  system: {
    icon: faBell,
    label: "System",
  },
};

const routeByEntity = (notification, role) => {
  const basePath = `/${role}`;
  switch (notification.entityType) {
    case "conversation":
      return `${basePath}/messages`;
    case "appointment":
      return `${basePath}/appointments`;
    case "document":
      return `${basePath}/documents`;
    case "post":
    case "comment":
      return `${basePath}/feed`;
    case "user":
      return `${basePath}/profile`;
    default:
      return `${basePath}`;
  }
};

const formatRelativeTime = (value) => {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationTray() {
  const { role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState({ unreadCount: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const visibleNotifications = notifications.slice(0, 8);

  const unreadCount =
    meta.unreadCount || notifications.filter((item) => !item.isRead).length;

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchNotifications({ limit: 8 });
      setNotifications(response.items);
      setMeta(response.meta || {});
    } catch (error) {
      showToast(error?.message || "Unable to load notifications.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const token = localStorage.getItem("metrobridge_token");
    const socket = getMessageSocket() || connectMessageSocket(token);
    if (!socket) return undefined;

    const handleNotification = (incomingNotification) => {
      const notification = normalizeNotification(incomingNotification);
      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }
        return [notification, ...current].slice(0, 8);
      });
      setMeta((current) => ({
        ...current,
        unreadCount: (current.unreadCount || 0) + 1,
      }));
    };

    const handleReconnect = () => {
      loadNotifications();
    };

    socket.on("notification:new", handleNotification);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("notification:new", handleNotification);
      socket.off("connect", handleReconnect);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const pollId = setInterval(() => {
      loadNotifications();
    }, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(pollId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  const handleOpenNotification = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, isRead: true, readAt: new Date().toISOString() }
              : item,
          ),
        );
        setMeta((current) => ({
          ...current,
          unreadCount: Math.max(0, (current.unreadCount || 0) - 1),
        }));
      }

      setIsOpen(false);
      navigate(routeByEntity(notification, role));
    } catch (error) {
      showToast(error?.message || "Unable to open notification.", "error");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        })),
      );
      setMeta((current) => ({ ...current, unreadCount: 0 }));
      showToast("All notifications marked as read.", "success");
    } catch (error) {
      showToast(error?.message || "Unable to update notifications.", "error");
    }
  };

  const latestNotificationLabel = useMemo(() => {
    if (!notifications.length) return "No new activity";
    return notifications[0].title;
  }, [notifications]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-soft"
        aria-label="Notifications">
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-[22rem] overflow-hidden rounded-3xl border border-border bg-white shadow-2xl sm:w-[22rem] md:w-[24rem] lg:w-[26rem] xl:w-[28rem]">
          <div className="bg-gradient-to-r from-primary via-primary-light to-accent px-4 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  Notifications
                </p>
                <h3 className="mt-1 text-lg text-white">
                  {latestNotificationLabel}
                </h3>
              </div>
              <Badge className="whitespace-nowrap bg-white/15 text-white">
                {unreadCount} unread
              </Badge>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-2 sm:max-h-[30rem]">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-neutral">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-neutral">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-primary">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <p className="font-semibold text-text">
                  You&apos;re all caught up
                </p>
                <p className="mt-1 text-small">
                  New reactions, comments, messages, and approvals will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {visibleNotifications.map((notification) => {
                  const config =
                    typeConfig[notification.type] || typeConfig.system;
                  const initials = (notification.actor?.fullName || "System")
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word.charAt(0))
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleOpenNotification(notification)}
                      className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                        notification.isRead ? "" : "bg-primary/5"
                      }`}>
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-sm font-semibold text-primary">
                        {notification.actor ? (
                          initials || <FontAwesomeIcon icon={config.icon} />
                        ) : (
                          <FontAwesomeIcon icon={config.icon} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-text">
                            {notification.title}
                          </p>
                          {!notification.isRead ? (
                            <span className="h-2 w-2 rounded-full bg-accent" />
                          ) : null}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-small text-neutral">
                          {notification.message || config.label}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-neutral">
                          <span>
                            {notification.actor?.fullName || "MetroBridge"}
                          </span>
                          <span>•</span>
                          <span>
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border bg-slate-50 px-4 py-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={loadNotifications}
              className="flex-1">
              Refresh
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex-1">
              Mark all read
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
