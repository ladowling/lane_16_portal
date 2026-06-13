import type { ReactNode } from 'react';
import { Modal, Typography } from 'antd';

const { Text, Title } = Typography;

type DetailField = {
  label: string;
  value: ReactNode;
};

type DetailSection = {
  heading: string;
  fields: DetailField[];
};

type DetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  sections: DetailSection[];
};

export function DetailModal({ open, onClose, title, sections }: DetailModalProps) {
  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={open}
      title={<span className="text-white">{title}</span>}
      width={920}
      className="[&_.ant-modal-close]:!text-white [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
    >
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <Title className="!mb-4 !mt-0 !text-xl !text-[#24d725]" level={3}>
              {section.heading}
            </Title>
            <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
              {section.fields.map((field) => (
                <div className="rounded-lg border border-[#575757] bg-[#111111] p-4" key={`${section.heading}-${field.label}`}>
                  <Text className="block !text-xs !font-bold !uppercase !text-[#a8a8a8]">
                    {field.label}
                  </Text>
                  <div className="mt-2 break-words text-base text-white">{field.value || 'N/A'}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  );
}
