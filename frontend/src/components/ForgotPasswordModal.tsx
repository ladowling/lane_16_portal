import { Button, Form, Input, Modal, Typography, message } from 'antd';
import { useState } from 'react';
import { forgotPassword, resetPassword } from '../api';

const { Text } = Typography;

type ForgotPasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

type ForgotPasswordValues = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [form] = Form.useForm<ForgotPasswordValues>();
  const [hasRequestedOtp, setHasRequestedOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestOtp = async () => {
    const { email } = await form.validateFields(['email']);
    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email);
      message.success(response.message || 'If the account exists, an OTP has been sent.');
      setHasRequestedOtp(true);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      const response = await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      message.success(response.message || 'Password reset successfully.');
      form.resetFields();
      setHasRequestedOtp(false);
      onClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      closable
      centered
      footer={null}
      onCancel={onClose}
      open={open}
      title={<span className="text-white m-3">Forgot Password</span>}
      className="[&_.ant-modal-close]:!text-white [&_.ant-modal-close]:pr-4 [&_.ant-modal-close]:!mt-1 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
    >
      <Text className="mb-5 block !text-[#c8c8c8]">
        Request an OTP, then enter the OTP and your new password.
      </Text>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleReset}
        className="[&_.ant-form-item-label>label]:!text-black [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white [&_.ant-input-affix-wrapper]:!border-[#575757] [&_.ant-input-affix-wrapper]:!bg-[#242424] [&_.ant-input-affix-wrapper_input]:!bg-[#242424] [&_.ant-input-affix-wrapper_input]:!text-white [&_.ant-input-password-icon]:!text-white"
      >
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Enter email' }, { type: 'email', message: 'Enter a valid email' }]}>
          <Input autoComplete="email" />
        </Form.Item>
        <Button className="mb-5" loading={isSubmitting} onClick={requestOtp}>
          Send OTP
        </Button>
        {hasRequestedOtp && (
          <>
            <Form.Item label="OTP" name="otp" rules={[{ required: true, message: 'Enter OTP' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: 'Enter new password' }, { min: 8, message: 'Use at least 8 characters' }]}>
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Confirm new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <div className="flex justify-end gap-3">
              <Button onClick={onClose}>Cancel</Button>
              <Button htmlType="submit" loading={isSubmitting} type="primary">
                Reset Password
              </Button>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
}

