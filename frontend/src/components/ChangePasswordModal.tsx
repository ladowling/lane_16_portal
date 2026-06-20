import { Button, Form, Input, Modal, Typography, message } from 'antd';
import { useState } from 'react';
import { changePassword } from '../api';

const { Text } = Typography;

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  token: string | null;
};

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordModal({ open, onClose, token }: ChangePasswordModalProps) {
  const [form] = Form.useForm<ChangePasswordValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ChangePasswordValues) => {
    if (!token) {
      message.error('You must be logged in to change your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await changePassword(token, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success(response.message || 'Password changed successfully.');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to change password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={open}
      title={<span className="text-white m-3">Change Password</span>}
      className="[&_.ant-modal-close]:!text-green-300 [&_.ant-modal-close]:pr-4 [&_.ant-modal-close]:!mt-1 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:!bg-[#0b0b0b] [&_.ant-modal-content]:p-8 [&_.ant-modal-header]:!bg-[#0b0b0b] [&_.ant-modal-title]:!text-white"
    >
      <Text className="mb-5 block !text-[#c8c8c8]">Enter your current password and choose a new one.</Text>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="[&_.ant-form-item-label>label]:!text-black [&_.ant-input-affix-wrapper]:!border-[#575757] [&_.ant-input-affix-wrapper]:!bg-[#242424] [&_.ant-input-affix-wrapper_input]:!bg-[#242424] [&_.ant-input-affix-wrapper_input]:!text-white [&_.ant-input-password-icon]:!text-white"
      >
        <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true, message: 'Enter current password' }]}>
          <Input.Password autoComplete="current-password" />
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
            Change Password
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

