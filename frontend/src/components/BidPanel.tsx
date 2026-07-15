import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined, StopOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';
import { useAuth } from '../Authontext';
import { checkBuyerAuctionHasBid, placeBid, registerForAuction } from '../api';

const { Paragraph, Text, Title } = Typography;

// ---------------------------------------------------------------------------
// Live countdown timer
// ---------------------------------------------------------------------------
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; total: number };

const getTimeLeft = (endTimeIso: string): TimeLeft => {
  const total = Math.max(0, new Date(endTimeIso).getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
};

function CountdownTimer({ endTimeIso }: { endTimeIso: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(endTimeIso));
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(endTimeIso));
    ref.current = setInterval(() => setTimeLeft(getTimeLeft(endTimeIso)), 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [endTimeIso]);

  if (timeLeft.total <= 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 py-3 text-[#888]">
        <StopOutlined />
        <span className="font-bold">Auction ended</span>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const parts: string[] = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
  parts.push(`${pad(timeLeft.hours)}h`);
  parts.push(`${pad(timeLeft.minutes)}m`);
  parts.push(`${pad(timeLeft.seconds)}s`);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#ffc5c7] px-5 py-3 text-[#5d1111]">
      <ClockCircleOutlined />
      <span className="text-lg font-extrabold">{parts.join(' ')} remaining</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BidPanel
// ---------------------------------------------------------------------------
type BidPanelProps = {
  vehicle: Vehicle;
};

export function BidPanel({ vehicle }: BidPanelProps) {
  const { token } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dealershipName, setDealershipName] = useState('');
  const [dealershipAddress, setDealershipAddress] = useState('');
  const [buyerHasBid, setBuyerHasBid] = useState<boolean | null>(null);

  const canBid = vehicle.canBid === true;
  const showDealershipInputs = canBid && buyerHasBid === false;

  useEffect(() => {
    setBuyerHasBid(null);
    setDealershipName('');
    setDealershipAddress('');

    if (!token || !vehicle.id || !canBid) {
      return;
    }

    let isMounted = true;

    const loadBuyerAuctionState = async () => {
      try {
        const response = await checkBuyerAuctionHasBid(token, vehicle.id);
        if (isMounted) {
          setBuyerHasBid(Boolean(response.hasBid));
        }
      } catch {
        if (isMounted) {
          setBuyerHasBid(false);
        }
      }
    };

    void loadBuyerAuctionState();

    return () => {
      isMounted = false;
    };
  }, [canBid, token, vehicle.id]);
  const currentHighBidNum =
    parseFloat((vehicle.currentHighBid ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const incrementNum = vehicle.bidIncrementAmount ?? 0;
  const nextMin = incrementNum > 0 ? currentHighBidNum + incrementNum : currentHighBidNum;

  const parsedBid = parseFloat(bidAmount.replace(/[^0-9.]/g, ''));
  const displayBid = !isNaN(parsedBid) && parsedBid > 0
    ? `$${parsedBid.toLocaleString()}`
    : '';

  const handlePlaceBid = () => {
    if (!bidAmount.trim()) {
      message.warning('Please enter a bid amount.');
      return;
    }
    if (isNaN(parsedBid) || parsedBid <= 0) {
      message.error('Please enter a valid bid amount.');
      return;
    }
    if (nextMin > 0 && parsedBid < nextMin) {
      message.error(`Your bid must be at least $${nextMin.toLocaleString()}.`);
      return;
    }
    setIsConfirmOpen(true);
  };

  const confirmBid = async () => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (showDealershipInputs && dealershipName.trim()) {
        await registerForAuction(token, vehicle.id, {
          newDealership: {
            name: dealershipName.trim(),
            address: dealershipAddress.trim() || undefined,
          }
        });
      }

      await placeBid(token, vehicle.id, parsedBid);
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
      setBidAmount('');
      setDealershipName('');
      setDealershipAddress('');
      setBuyerHasBid(true);
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <aside className="min-h-full rounded-xl border border-[#575757] bg-[#0b0b0b] px-[30px] py-12 max-[620px]:p-[22px]">
        <Title className="!mb-8 !mt-0 !text-[28px] !leading-[1.15] !text-white" level={2}>
          Bidding Details
        </Title>

        {/* Current High Bid */}
        <div className="mb-5 flex items-center justify-between gap-6 border-b border-[#1f1f1f] pb-5 max-[620px]:flex-col max-[620px]:items-start">
          <Text className="!text-[20px] !text-[#acff9e]">Current High Bid</Text>
          <strong className="text-[28px] text-[#27d82e]">
            {vehicle.currentHighBid || '$0'}
          </strong>
        </div>

        {/* Next Minimum */}
        {nextMin > 0 && (
          <div className="mb-5 flex items-center justify-between gap-6 border-b border-[#1f1f1f] pb-5 max-[620px]:flex-col max-[620px]:items-start">
            <Text className="!text-[20px] !text-[#acff9e]">Next Minimum</Text>
            <strong className="text-[28px] text-[#27d82e]">
              ${nextMin.toLocaleString()}
            </strong>
          </div>
        )}

        {/* Total bids */}
        <div className="mb-8 flex items-center justify-between gap-6 border-b border-[#1f1f1f] pb-5 max-[620px]:flex-col max-[620px]:items-start">
          <Text className="!text-[20px] !text-[#acff9e]">Total Bids</Text>
          <strong className="text-[28px] text-white">{vehicle.bidCount ?? 0}</strong>
        </div>

        {/* Countdown / Status */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {canBid && vehicle.auctionEndTime ? (
            <>
              <CountdownTimer endTimeIso={vehicle.auctionEndTime} />
              <span className="flex items-center gap-1 text-[18px] font-bold text-amber-400">
                <FireOutlined /> LIVE
              </span>
              {vehicle.reserveMet && (
                <span className="flex items-center gap-1 text-[18px] font-bold text-amber-400 animate-pulse">
                  Reserve Met
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 py-3 text-[#c8c8c8]">
              <ClockCircleOutlined />
              <span className="font-semibold">
                {vehicle.biddingStatusLabel || 'Bidding not active'}
              </span>
            </div>
          )}
        </div>

        {/* Upcoming auction start */}
        {!canBid && vehicle.auctionStartTime && new Date(vehicle.auctionStartTime) > new Date() && (
          <p className="mb-4 text-sm text-[#888]">
            Auction starts:{' '}
            {new Date(vehicle.auctionStartTime).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        )}

        {/* Bid input — only visible when bidding is active */}
        {canBid && (
          <>
            <Input
              className="!mb-4 !h-[52px] !rounded-lg !border-white !bg-[#242424] !text-lg !text-white placeholder:!text-[#888]"
              placeholder={`Enter bid amount (min $${nextMin.toLocaleString()})`}
              prefix={<span className="text-[#888]">$</span>}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              onPressEnter={handlePlaceBid}
              type="number"
              min={nextMin}
            />
            {showDealershipInputs && (
              <div className="mb-4 space-y-3">
                <Text className="block !text-sm !text-[#c8c8c8]">
                  Bidding on behalf of another dealership? Provide details below to override your default dealership.
                </Text>
                <Input
                  className="!h-10 !rounded-lg !border-white !bg-[#242424] !text-base !text-white placeholder:!text-[#888]"
                  placeholder="Dealership Name (Optional)"
                  value={dealershipName}
                  onChange={(e) => setDealershipName(e.target.value)}
                />
                <Input
                  className="!h-10 !rounded-lg !border-white !bg-[#242424] !text-base !text-white placeholder:!text-[#888]"
                  placeholder="Dealership Address (Optional)"
                  value={dealershipAddress}
                  onChange={(e) => setDealershipAddress(e.target.value)}
                />
              </div>
            )}
            <Button
              type="primary"
              size="large"
              block
              className="!h-16 !rounded-lg !text-2xl !font-bold"
              onClick={handlePlaceBid}
            >
              Place Bid
            </Button>
          </>
        )}

        <Text className="mt-4 block !text-sm !text-[#888]">
          Dealer bids are subject to final vehicle verification.
        </Text>
      </aside>

      {/* ── Confirm Bid Modal ── */}
      <Modal
        centered
        open={isConfirmOpen}
        footer={null}
        closable={false}
        width={500}
        className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:!bg-white [&_.ant-modal-content]:p-10 [&_.ant-modal-content]:text-center"
        onCancel={() => setIsConfirmOpen(false)}
        maskClosable
      >
        <div className="flex flex-col items-center text-center">
          <Text className="!text-sm !font-bold !uppercase !tracking-widest !text-[#24d725]">Vehicle</Text>
          <Title className="!mt-1 !text-[#111]" level={3}>
            {vehicle.detailsTitle || vehicle.title}
          </Title>
          <Text className="!text-sm !font-bold !uppercase !tracking-widest !text-[#24d725]">Your Bid</Text>
          <Title className="!mt-1 !text-[#111]" level={3}>
            {displayBid}
          </Title>
          {showDealershipInputs && (dealershipName.trim() || dealershipAddress.trim()) && (
            <div className="mt-4 rounded-lg bg-[#f9f9f9] p-3 text-left border border-[#eee]">
              <Text className="!text-xs !font-bold !uppercase !tracking-widest !text-[#888] block mb-1">Dealership Override</Text>
              {dealershipName.trim() && <div className="text-sm"><strong>Name:</strong> {dealershipName}</div>}
              {dealershipAddress.trim() && <div className="text-sm"><strong>Address:</strong> {dealershipAddress}</div>}
            </div>
          )}
          <Paragraph className="mt-4 !text-base !text-[#555]">
            This action cannot be undone
          </Paragraph>
          <Space size={20} className="mt-6 flex-wrap justify-center">
            <Button
              size="large"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
              className="!min-w-[120px] !rounded-lg !border-[#24d725] !text-[#24d725] hover:!bg-[#f0fff0]"
            >
              Back
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={confirmBid}
              loading={isSubmitting}
              className="!min-w-[140px] !rounded-lg"
            >
              Confirm Bid
            </Button>
          </Space>
        </div>
      </Modal>

      {/* ── Success Modal ── */}
      <Modal
        centered
        open={isSuccessOpen}
        footer={null}
        closable={false}
        width={500}
        className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:!bg-white [&_.ant-modal-content]:p-10"
        onCancel={() => setIsSuccessOpen(false)}
        maskClosable
      >
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircleOutlined className="mb-4 text-6xl !text-[#24d725]" />
          <Title className="!text-black" level={2}>
            Bid Submitted Successfully
          </Title>
          <Text className="!text-[#555]">You are currently the highest bidder.</Text>
        </div>
      </Modal>
    </>
  );
}

