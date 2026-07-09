import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { HardDrive, Check, Link2Off } from "lucide-react";
import Card from "../../shared/ui/Card.jsx";
import Button from "../../shared/ui/Button.jsx";
import { connectGoogleDrive, getDriveStatus, disconnectGoogleDrive } from "../../services/driveService.js";
import { toast } from "../../core/store/toastStore.js";

export default function IntegrationsSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["drive-status"], queryFn: getDriveStatus });

  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogleDrive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drive-status"] });
      toast({ type: "info", title: "Disconnected", message: "Google Drive is no longer connected." });
    },
  });

  useEffect(() => {
    const status = searchParams.get("drive");
    if (status === "connected") {
      toast({ type: "success", title: "Google Drive connected", message: "Meeting recordings will upload here." });
      queryClient.invalidateQueries({ queryKey: ["drive-status"] });
    } else if (status === "error") {
      toast({ type: "error", title: "Connection failed", message: "Couldn't connect Google Drive. Please try again." });
    }
    if (status) {
      searchParams.delete("drive");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connected = data?.connected;

  return (
    <Card>
      <h3 className="mb-1 font-display text-base font-semibold text-[var(--text)]">Integrations</h3>
      <p className="mb-5 text-sm text-[var(--text-secondary)]">Connect services used elsewhere in the app.</p>

      <div className="flex items-center justify-between rounded-md border border-[var(--border)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand-subtle)]">
            <HardDrive size={16} className="text-[var(--brand)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text)]">Google Drive</p>
            <p className="text-xs text-[var(--text-muted)]">
              {isLoading ? "Checking…" : connected ? (
                <span className="flex items-center gap-1 text-[var(--success)]"><Check size={12} /> Connected as {data.email}</span>
              ) : (
                "Meeting recordings you host upload here"
              )}
            </p>
          </div>
        </div>
        {connected ? (
          <Button size="sm" variant="outline" icon={Link2Off} loading={disconnectMutation.isPending} onClick={() => disconnectMutation.mutate()}>
            Disconnect
          </Button>
        ) : (
          <Button size="sm" onClick={connectGoogleDrive}>
            Connect
          </Button>
        )}
      </div>
    </Card>
  );
}
