import { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useAuth } from '../Authontext';
import * as authService from '../AuthService';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';


const { Text, Title } = Typography;

type LoginPageProps = {
  onDealerLogin: () => void;
  onAdminLogin: () => void;
};

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage({ onDealerLogin, onAdminLogin }: LoginPageProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { token, user } = await authService.login(values.email, values.password);
      login(token, user);

      if (user.role === 'admin' || user.role === 'staff') {
        onAdminLogin();
      } else {
        onDealerLogin();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-lane-ink px-4">
      <div className="w-full max-w-md rounded-xl border border-[#575757] bg-[#0b0b0b] px-10 py-12">
        <Title
          level={2}
          className="!mb-2 !mt-0 !text-center !text-[32px] !font-bold !text-white"
        >
          Login
        </Title>
        <Text className="mb-8 block !text-center !text-[#c8c8c8]">
          Sign in to access your Lane16 account
        </Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-8 [&_.ant-form-item-label>label]:!text-white [&_.ant-input]:!rounded-lg [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-[#242424] [&_.ant-input]:!text-white [&_.ant-input-affix-wrapper]:!rounded-lg [&_.ant-input-affix-wrapper]:!border-[#575757] [&_.ant-input-affix-wrapper]:!bg-[#242424] [&_.ant-input-affix-wrapper_input]:!bg-[#242424] [&_.ant-input-affix-wrapper_input]:!text-white [&_.ant-input-password-icon]:!text-white"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input size="large" placeholder="you@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password size="large" placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          {errorMessage && (
            <Text className="mb-4 block !text-[#ff7875]">{errorMessage}</Text>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            className="!mt-4 !h-14 !rounded-lg !text-lg !font-bold"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
          <Button
            block
            className="!mt-3 !text-[#24d725] hover:!text-white"
            onClick={() => setIsForgotPasswordOpen(true)}
            type="link"
          >
            Forgot password?
          </Button>
        </Form>
      </div>
      <ForgotPasswordModal open={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
    </main>
  );
}

