import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Space, Typography, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';
import { useAuth } from '../Authontext';
import { placeBid } from '../api';

const { Text, Title } = Typography;

// ---------------------------------------------------------------------------
// Countdown helpers
// ---------------------------------------------------------------------------

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

const getTimeLeft = (endTimeIso: string): TimeLeft => {
  const total = Math.max(0, new Date(endTimeIso).getTime() - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, total };
};

function CountdownTimer({ endTimeIso }: { endTimeIso: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(endTimeIso));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(endTimeIso));
    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft(endTimeIso));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTimeIso]);

  if (timeLeft.total <= 0) {
    return (
      <div className="mb-[38px] mt-2 inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[#333] px-[20px] text-[18px] font-extrabold text-[#c8c8c8] max-[620px]:w-full max-[620px]:justify-center">
        <ClockCircleOutlined />
        <span>Auction ended</span>
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
    <div className="mb-[38px] mt-2 inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[#ffc5c7] px-[24px] py-2 text-[20px] font-extrabold text-[#5d1111] max-[620px]:w-full max-[620px]:justify-center max-[620px]:px-3 max-[620px]:text-lg">
      <ClockCircleOutlined />
      <span>{parts.join(' ')} remaining</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BidPanel
// ---------------------------------------------------------------------------

type BidPanelProps = {
  vehicle: Vehicle;
  onBidPlaced?: () => void;
};

type BidFormValues = {
  dealerName: string;
  dealerPhone: string;
  contactPerson: string;
  contactPhone: string;
  bidAmount: string;
  note?: string;
};

export function BidPanel({ vehicle, onBidPlaced }: BidPanelProps) {
  const { token, user } = useAuth();
  const [form] = Form.useForm<BidFormValues>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingValues, setPendingValues] = useState<BidFormValues | null>(null);

  const canBid = vehicle.canBid === true;

  // Parse current high bid as a number for validation
  const currentHighBidNum = parseFloat(
    (vehicle.currentHighBid ?? '0').replace(/[^0-9.]/g, '')
  ) || 0;
  const incrementNum = vehicle.bidIncrementAmount ?? 100;
  const minimumNextBid = currentHighBidNum + incrementNum;

  const handleFormSubmit = (values: BidFormValues) => {
    const amount = parseFloat(values.bidAmount.replace(/[^0-9.]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      message.error('Please enter a valid bid amount.');
      return;
    }
    if (amount < minimumNextBid) {
      message.error(`Your bid must be at least $${minimumNextBid.toLocaleString()} (current high + increment).`);
      return;
    }
    setPendingValues(values);
    setIsConfirmOpen(true);
  };

  const confirmBid = async () => {
    if (!pendingValues || !token || !user) return;

    const amount = parseFloat(pendingValues.bidAmount.replace(/[^0-9.]/g, ''));

    setIsSubmitting(true);
    try {
      await placeBid(token, vehicle.id, {
        dealerName: pendingValues.dealerName,
        dealerEmail: user.email,
        dealerPhone: pendingValues.dealerPhone,
        contactPerson: pendingValues.contactPerson,
        contactPhone: pendingValues.contactPhone,
        bidAmount: amount,
        note: pendingValues.note,
      });
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
      form.resetFields(['bidAmount', 'note']);
      onBidPlaced?.();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayAmount = pendingValues?.bidAmount
    ? `$${parseFloat(pendingValues.bidAmount.replace(/[^0-9.]/g, '')).toLocaleString()}`
    : '';

  return (
    <>
      <aside className="min-h-full rounded-xl border border-[#575757] bg-[#0b0b0b] px-[30px] py-12 max-[620px]:p-[22px]">
        <Title className="!mb-6 !mt-0 !text-[28px] !leading-[1.15] !text-white" level={2}>
          Bidding Details
        </Title>

        {/* Current high bid */}
        <div className="mb-5 flex items-center justify-between gap-6 max-[620px]:items-start max-[620px]:flex-col">
          <Text className="!text-[22px] !text-[#acff9e]">Current High Bid</Text>
          <strong className="text-[26px] text-[#27d82e]">
            {vehicle.currentHighBid || '$0'}
          </strong>
        </div>

        {/* Next minimum bid */}
        <div className="mb-5 flex items-center justify-between gap-6 max-[620px]:items-start max-[620px]:flex-col">
          <Text className="!text-[22px] !text-[#acff9e]">Next Minimum</Text>
          <strong className="text-[26px] text-[#27d82e]">
            ${minimumNextBid.toLocaleString()}
          </strong>
        </div>

        {/* Bid count */}
        <div className="mb-6 flex items-center justify-between gap-6 max-[620px]:items-start max-[620px]:flex-col">
          <Text className="!text-[22px] !text-[#acff9e]">Total Bids</Text>
          <strong className="text-[26px] text-white">
            {vehicle.bidCount ?? 0}
          </strong>
        </div>

        {/* Countdown or status */}
        <div className="flex flex-wrap items-center gap-3">
          {canBid && vehicle.auctionEndTime ? (
            <CountdownTimer endTimeIso={vehicle.auctionEndTime} />
          ) : (
            <div className="mb-[38px] mt-2 inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[#242424] px-[20px] py-2 text-[18px] font-extrabold text-[#c8c8c8] max-[620px]:w-full max-[620px]:justify-center">
              <ClockCircleOutlined />
              <span>{vehicle.biddingStatusLabel || 'Bidding not active'}</span>
            </div>
          )}
          {vehicle.canBid && (
            <div className="mb-[38px] mt-2 flex items-center gap-1 text-[18px] font-bold text-amber-400">
              <FireOutlined />
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* Bid form (only shown when bidding is active) */}
        {canBid ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            className="[&_.ant-form-item-label>label]:!text-[#c8c8c8] [&_.ant-input]:!rounded-lg [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white"
          >
            <Form.Item
              label="Dealer / Company Name"
              name="dealerName"
              rules={[{ required: true, message: 'Please enter your dealer name' }]}
            >
              <Input size="large" placeholder="e.g. Crestline Motors" />
            </Form.Item>

            <Form.Item
              label="Dealer Phone"
              name="dealerPhone"
              rules={[{ required: true, message: 'Please enter your dealer phone' }]}
            >
              <Input size="large" placeholder="e.g. (972) 555-0110" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Contact Person"
                name="contactPerson"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input size="large" placeholder="Full name" />
              </Form.Item>
              <Form.Item
                label="Contact Phone"
                name="contactPhone"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input size="large" placeholder="Phone" />
              </Form.Item>
            </div>

            <Form.Item
              label={`Bid Amount (min $${minimumNextBid.toLocaleString()})`}
              name="bidAmount"
              rules={[
                { required: true, message: 'Please enter a bid amount' },
                {
                  validator: (_, value) => {
                    const amount = parseFloat((value ?? '').replace(/[^0-9.]/g, ''));
                    if (isNaN(amount) || amount < minimumNextBid) {
                      return Promise.reject(`Minimum bid is $${minimumNextBid.toLocaleString()}`);
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                size="large"
                prefix="$"
                placeholder={minimumNextBid.toLocaleString()}
                className="!rounded-lg !border-white !bg-[#242424] !text-lg !text-white"
              />
            </Form.Item>

            <Form.Item label="Note (optional)" name="note">
              <Input.TextArea
                rows={2}
                placeholder="Any additional notes for the seller"
                className="!rounded-lg !border-[#575757] !bg-[#242424] !text-[#c8c8c8]"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="!mt-4 !h-16 !rounded-lg !text-2xl !font-bold"
            >
              Place Bid
            </Button>

            <Text className="mt-[18px] block !text-base !text-[#c8c8c8]">
              Dealer bids are subject to final vehicle verification.
            </Text>
          </Form>
        ) : (
          <>
            <div className="mb-4 rounded-lg border border-[#333] bg-[#111] px-5 py-4 text-center text-[#c8c8c8]">
              <p className="text-lg font-semibold">
                {vehicle.biddingStatusLabel || 'Bidding is not currently active for this vehicle.'}
              </p>
              {vehicle.auctionStartTime && new Date(vehicle.auctionStartTime) > new Date() && (
                <p className="mt-1 text-sm text-[#888]">
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
            </div>
            <Text className="mt-4 block !text-base !text-[#c8c8c8]">
              Dealer bids are subject to final vehicle verification.
            </Text>
          </>
        )}
      </aside>

      {/* Confirm Modal */}
      <Modal
        centered
        open={isConfirmOpen}
        footer={null}
        closable={false}
        width={760}
        className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-10 [&_.ant-modal-content]:text-center"
        onCancel={() => setIsConfirmOpen(false)}
        maskClosable
      >
        <div className="flex flex-col items-center text-center">
          <Text className="!text-sm !font-bold !uppercase !tracking-[0.2em] !text-[#c8c8c8]">Vehicle</Text>
          <Title className="!text-white" level={3}>
            {vehicle.detailsTitle || vehicle.title}
          </Title>
          <Text className="!text-sm !font-bold !uppercase !tracking-[0.2em] !text-[#c8c8c8]">Your Bid</Text>
          <Title className="!text-white" level={3}>
            {displayAmount}
          </Title>
          <Text className="mt-2 !text-lg !font-bold !text-[#ffc5c7]">
            By confirming, you are submitting a firm dealer bid subject to Lane16's verification terms.
          </Text>
          <Space size={28} className="mt-8 flex-wrap justify-center">
            <Button size="large" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
              Back
            </Button>
            <Button size="large" type="primary" onClick={confirmBid} loading={isSubmitting}>
              Confirm Bid
            </Button>
          </Space>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        centered
        open={isSuccessOpen}
        footer={null}
        closable={false}
        width={760}
        className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-10 [&_.ant-modal-content]:text-center"
        onCancel={() => setIsSuccessOpen(false)}
        maskClosable
      >
        <CheckCircleOutlined className="mb-5 text-6xl !text-[#24d725]" />
        <Title className="!text-white" level={2}>
          Bid Submitted Successfully
        </Title>
        <Text className="!text-white">
          Your bid of {displayAmount} on{' '}
          <strong>{vehicle.detailsTitle || vehicle.title}</strong> has been received.
          You will be contacted if you are the winning bidder.
        </Text>
        <Button
          type="primary"
          size="large"
          block
          className="!mt-8 !h-12 !rounded-lg"
          onClick={() => setIsSuccessOpen(false)}
        >
          Close
        </Button>
      </Modal>
    </>
  );
}
