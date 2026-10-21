import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { getAllBranches } from "@/services/branch.service";
import { getQueueStatus, assignNext } from "@/services/queue.service";
import { getAllBarbers } from "@/services/barber.service";

import {
  initializeSocket,
  joinQueueRoom,
  leaveQueueRoom,
  onQueueUpdated,
} from "@/services/socket.service";

import { Card, CardContent } from "@/components/ui/card";

import QueueHeader from "@/components/queue/QueueHeader";
import QueueBranchSelector from "@/components/queue/QueueBranchSelector";
import QueueError from "@/components/queue/QueueError";
import QueueBarberAssignment from "@/components/queue/QueueBarberAssignment";
import QueueStats from "@/components/queue/QueueStats";
import WaitingQueue from "@/components/queue/WaitingQueue";
import InProgressQueue from "@/components/queue/InProgressQueue";

function Queue() {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [queue, setQueue] = useState(null);

  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);

  const [error, setError] = useState(false);

  const [barbers, setBarbers] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState("");

  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const loadBranches = async () => {
    try {
      setIsLoadingBranches(true);
      setError(false);

      const response = await getAllBranches();

      const branchList = response?.data || [];

      setBranches(branchList);

      const firstActiveBranch = branchList.find(
        (branch) => branch.isActive,
      );

      if (firstActiveBranch?._id) {
        setSelectedBranchId(firstActiveBranch._id);
      }
    } catch (error) {
      console.error("Queue branches error:", error);
      setError(true);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const loadQueue = async (branchId) => {
    if (!branchId) {
      setQueue(null);
      return;
    }

    try {
      setIsLoadingQueue(true);
      setError(false);

      const response = await getQueueStatus(branchId);

      setQueue(response?.data || null);
    } catch (error) {
      console.error("Queue error:", error);

      setError(true);
      setQueue(null);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  const loadBarbers = async (branchId) => {
    if (!branchId) {
      setBarbers([]);
      setSelectedBarberId("");
      return;
    }

    try {
      setIsLoadingBarbers(true);

      const response = await getAllBarbers({
        branchId,
      });

      const barberList = response?.data || [];

      setBarbers(barberList);

      setSelectedBarberId(
        barberList.length > 0 ? barberList[0]._id : "",
      );
    } catch (error) {
      console.error("Queue barbers error:", error);

      setBarbers([]);
      setSelectedBarberId("");
      setError(true);
    } finally {
      setIsLoadingBarbers(false);
    }
  };

  const handleAssignNext = async () => {
    if (
      !selectedBranchId ||
      !selectedBarberId ||
      isAssigning
    ) {
      return;
    }

    try {
      setIsAssigning(true);
      setError(false);

      await assignNext({
        branchId: selectedBranchId,
        barberId: selectedBarberId,
      });

      await loadQueue(selectedBranchId);
    } catch (error) {
      console.error("Assign next error:", error);

      setError(true);
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadBranches();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!selectedBranchId) {
      return;
    }

    let cleanupQueueListener = () => {};

    const setupQueueRealtime = async () => {
      await Promise.resolve(initializeSocket());

      joinQueueRoom(selectedBranchId);

      cleanupQueueListener = onQueueUpdated((data) => {
        console.log("QUEUE UPDATED:", data);

        void loadQueue(selectedBranchId);
      });
    };

    const timeoutId = window.setTimeout(() => {
      void loadQueue(selectedBranchId);
      void loadBarbers(selectedBranchId);
      void setupQueueRealtime();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);

      cleanupQueueListener();

      leaveQueueRoom(selectedBranchId);
    };
  }, [selectedBranchId]);

  const selectedBranch = branches.find(
    (branch) => branch._id === selectedBranchId,
  );

  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    setSelectedBarberId("");
    setBarbers([]);
    setQueue(null);
    setError(false);
  };

  return (
    <div className="space-y-6">
      <QueueHeader />

      <QueueBranchSelector
        branches={branches}
        selectedBranchId={selectedBranchId}
        onBranchChange={handleBranchChange}
        isLoading={isLoadingBranches}
      />

      {error && (
        <QueueError
          selectedBranchId={selectedBranchId}
          onRetry={() => {
            void loadQueue(selectedBranchId);
            void loadBarbers(selectedBranchId);
          }}
        />
      )}

      {!isLoadingBranches &&
        !selectedBranchId &&
        !error && (
          <Card className="overflow-hidden rounded-2xl border border-[#304156] bg-[#172132] shadow-xl shadow-black/10">
            <CardContent className="p-10 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#485F4D] bg-[#223328]">
                <Users className="size-6 text-[#8FA985]" />
              </div>

              <p className="mt-4 font-bold text-white">
                Select a branch
              </p>

              <p className="mt-1 text-sm text-[#90A1B9]">
                Select a branch to view its live queue.
              </p>
            </CardContent>
          </Card>
        )}

      {selectedBranchId && !error && (
        <>
          {selectedBranch && (
            <div className="flex items-center justify-between rounded-2xl border border-[#304156] bg-[#172132] px-5 py-4 shadow-lg shadow-black/5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#71829B]">
                  Active Queue
                </p>

                <p className="mt-1 text-lg font-extrabold text-white">
                  {selectedBranch.name}
                </p>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="size-2 rounded-full bg-[#78B65B] shadow-[0_0_10px_rgba(120,182,91,0.6)]" />

                <span className="text-xs font-bold text-[#8FA985]">
                  Live
                </span>
              </div>
            </div>
          )}

          {isLoadingQueue && (
            <div className="flex min-h-40 items-center justify-center rounded-2xl border border-[#304156] bg-[#172132]">
              <div className="text-center">
                <div className="mx-auto size-8 animate-spin rounded-full border-2 border-[#34445A] border-t-[#8FA985]" />

                <p className="mt-3 text-sm font-medium text-[#90A1B9]">
                  Loading queue...
                </p>
              </div>
            </div>
          )}

          <QueueBarberAssignment
            barbers={barbers}
            selectedBarberId={selectedBarberId}
            onBarberChange={setSelectedBarberId}
            isLoadingBarbers={isLoadingBarbers}
            isAssigning={isAssigning}
            selectedBranchId={selectedBranchId}
            hasWaitingCustomers={Boolean(queue?.waiting?.length)}
            onAssignNext={handleAssignNext}
          />

          {!isLoadingQueue && queue && (
            <>
              <QueueStats queue={queue} />

              <WaitingQueue
                queue={queue}
                selectedBranchId={selectedBranchId}
                isLoadingQueue={isLoadingQueue}
                onRefresh={loadQueue}
              />

              <InProgressQueue queue={queue} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Queue;