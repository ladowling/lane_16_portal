import { MailOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Row, Typography } from 'antd';
import { useState } from 'react';
import { ConfirmationModal } from '../components/ConfirmationModal';

const { Paragraph, Text, Title } = Typography;

export function ContactPage() {
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitForm = () => {
    setIsSubmitted(true);
    form.resetFields();
  };

  return (
    <main className="mx-auto w-[min(1280px,calc(100%-112px))] px-0 pb-[170px] pt-[52px] max-[980px]:w-[min(calc(100%-32px),760px)] max-[980px]:pt-10 max-[620px]:w-[min(calc(100%-24px),420px)] max-[620px]:pb-20">
      <header className="text-center">
        <Title className="!mb-16 !mt-0 !text-center !text-[58px] !font-medium !leading-none !text-white max-[980px]:!mb-[38px] max-[980px]:!text-[44px] max-[620px]:!text-[38px]">Contact Lane16</Title>
        <Text className="!text-white">Questions? We're here to help</Text>
      </header>
      <Divider className="!border-[#575757]" />

      <Paragraph className="!mx-auto !mb-7 !max-w-4xl !text-center !text-lg !leading-8 !text-white">
        Please use the form below for questions about selling a vehicle, dealer access, current listings, bidding, account support, or general Lane16
        platform assistance.
      </Paragraph>

      <section className="rounded-lg border border-[#575757] bg-[#0b0b0b] p-6">
        <Title className="!mt-0 !text-[26px] !font-bold !text-white" level={2}>Contact Information</Title>
        <div className="flex items-center gap-3 text-lg text-[#cfcfcf]">
          <MailOutlined className="!text-2xl !text-[#24d725]" />
          <Text className="!text-white">Support@Lane16.com.</Text>
        </div>
      </section>

      <Divider className="!border-[#575757]" />

      <section>
        <Title level={2} className="!mt-0 !text-[26px] !font-bold !text-white">
          Contact Form
        </Title>
        <Form form={form} layout="vertical" onFinish={submitForm} className="[&_.ant-form-item-label>label]:!text-white [&_.ant-input]:!rounded-lg [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white [&_textarea.ant-input]:!resize-none">
          <Row gutter={[28, 18]}>
            <Col xs={24} md={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Enter your name' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Phone Number" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Enter a message' }]}>
              <Input.TextArea rows={7} />
            </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" className="!h-14 !min-w-[220px] !rounded-lg !text-lg !font-bold">
            Submit Message
          </Button>
        </Form>
      </section>

      <ConfirmationModal
        open={isSubmitted}
        title="Submission Confirmed"
        message="Thank you for contacting Lane16. Your message has been received, and someone from our team will follow up as soon as possible."
        onClose={() => setIsSubmitted(false)}
      />
    </main>
  );
}
