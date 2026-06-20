import { CheckCircleOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';

const { Paragraph, Title } = Typography;

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export function ConfirmationModal({ open, title, message, onClose }: ConfirmationModalProps) {
  return (
    <Modal
      centered
      open={open}
      footer={null}
      closable={false}
      width={760}
      className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-white [&_.ant-modal-content]:p-10"
      onCancel={onClose}
      maskClosable
    >
      <div className="flex flex-col items-center justify-center text-center">
        <CheckCircleOutlined className="mb-5 text-6xl !text-[#24d725]" />
        <Title className="!text-black" level={2}>{title}</Title>
        <Paragraph className="!text-[#555]">{message}</Paragraph>
      </div>
    </Modal>
  );
}
