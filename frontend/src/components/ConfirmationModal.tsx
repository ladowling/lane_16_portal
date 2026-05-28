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
      className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-10 [&_.ant-modal-content]:text-center"
      onCancel={onClose}
      maskClosable
    >
      <CheckCircleOutlined className="mb-5 text-6xl !text-[#24d725]" />
      <Title className="!text-white" level={2}>{title}</Title>
      <Paragraph className="!text-white">{message}</Paragraph>
    </Modal>
  );
}
