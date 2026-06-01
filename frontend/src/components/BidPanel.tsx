import { useState } from 'react';
import { Button, Input, Modal, Space, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Vehicle } from '../types';

const { Text, Title } = Typography;

type BidPanelProps = {
  vehicle: Vehicle;
};

export function BidPanel({ vehicle }: BidPanelProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const displayBid = bidAmount.trim() || '$25,500';

  const confirmBid = () => {
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <>
      <aside className="min-h-full rounded-xl border border-[#575757] bg-[#0b0b0b] px-[30px] py-12 max-[620px]:p-[22px]">
        <Title className="!mb-6 !mt-0 !text-[28px] !leading-[1.15] !text-white" level={2}>Bidding Details</Title>

        <div className="mb-5 flex items-center justify-between gap-6 max-[620px]:items-start max-[620px]:flex-col">
          <Text className="!text-[28px] !text-[#acff9e]">Current High Bid</Text>
          <strong className="text-[30px] text-[#27d82e]">{vehicle.currentHighBid}</strong>
        </div>

        <div className="mb-5 flex items-center justify-between gap-6 max-[620px]:items-start max-[620px]:flex-col">
          <Text className="!text-[28px] !text-[#acff9e]">Next Minimum</Text>
          <strong className="text-[30px] text-[#27d82e]">{vehicle.nextMinimumBid}</strong>
        </div>

        <div className="mb-[38px] mt-2 inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[#ffc5c7] px-[38px] text-[22px] font-extrabold text-[#5d1111] max-[620px]:w-full max-[620px]:justify-center max-[620px]:px-3 max-[620px]:text-lg">
          <ClockCircleOutlined />
          <span>2:14:33 remaining</span>
        </div>

        <Input className="!h-[52px] !rounded-lg !border-white !bg-[#242424] !text-lg !text-white placeholder:!text-white" placeholder="Click to enter bid" value={bidAmount} onChange={(event) => setBidAmount(event.target.value)} />

        <Button type="primary" size="large" block className="!mt-11 !h-16 !rounded-lg !text-2xl !font-bold" onClick={() => setIsConfirmOpen(true)}>
          Place Bid
        </Button>

        <Text className="mt-[26px] block !text-lg !text-white">Dealer bids are subject to final vehicle verification.</Text>
      </aside>

      <Modal centered open={isConfirmOpen} footer={null} closable={false} width={760} className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-10 [&_.ant-modal-content]:text-center" onCancel={() => setIsConfirmOpen(false)} maskClosable>
        <div className="flex flex-col items-center text-center">
          <Text className="!text-sm !font-bold !uppercase !tracking-[0.2em] !text-[#c8c8c8]">Vehicle</Text>
          <Title className="!text-white" level={3}>2021 Mercedes-Benz GLE 350</Title>
          <Text className="!text-sm !font-bold !uppercase !tracking-[0.2em] !text-[#c8c8c8]">Your Bid</Text>
          <Title className="!text-white" level={3}>{displayBid}</Title>
          <Text className="mt-2 !text-lg !font-bold !text-[#ffc5c7]">This action cannot be undone</Text>
          <Space size={28} className="mt-8 flex-wrap justify-center">
            <Button size="large" onClick={() => setIsConfirmOpen(false)}>
              Back
            </Button>
            <Button size="large" type="primary" onClick={confirmBid}>
              Confirm Bid
            </Button>
          </Space>
        </div>
      </Modal>

      <Modal centered open={isSuccessOpen} footer={null} closable={false} width={760} className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-10 [&_.ant-modal-content]:text-center" onCancel={() => setIsSuccessOpen(false)} maskClosable>
        <CheckCircleOutlined className="mb-5 text-6xl !text-[#24d725]" />
        <Title className="!text-white" level={2}>Bid Submitted Successfully</Title>
        <Text className="!text-white">You are currently the highest bidder.</Text>
      </Modal>
    </>
  );
}
