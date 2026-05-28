import React from 'react';
import { Form, Input, Select, Upload, ConfigProvider, theme } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';

const { Option } = Select;
const { Dragger } = Upload;

export default function SubmitVehicle() {
  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-24">
      <div className="bg-[#111] py-16 text-center border-b border-gray-800 mb-12">
        <h1 className="text-5xl font-bold text-white">Submit Vehicle</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#22c55e', colorBgContainer: '#111' } }}>
          <Form layout="vertical" size="large" requiredMark={false} className="space-y-12">
            
            {/* Section 1: Vehicle Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Vehicle Information</h2>
              <div className="space-y-4">
                <Form.Item label="Name" name="name">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                <Form.Item label="Contact information" name="contact">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                <Form.Item label="VIN" name="vin">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item label="Year" name="year"><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                  <Form.Item label="Make" name="make"><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                  <Form.Item label="Model" name="model"><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                </div>

                <Form.Item label="Mileage" name="mileage">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                <Form.Item label="Title status" name="titleStatus">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                <Form.Item label="Payoff/lien information" name="payoff">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
              </div>
            </section>

            {/* Section 2: Condition Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Condition information</h2>
              <div className="space-y-4">
                {['Exterior', 'Interior', 'Mechanical', 'Tires', 'Smoker vehicle', 'Warning light'].map((field) => (
                  <Form.Item key={field} label={field} name={field.toLowerCase().replace(' ', '_')}>
                    <Select placeholder="Click to select" className="w-full" popupClassName="bg-[#111]">
                      <Option value="excellent">Excellent</Option>
                      <Option value="good">Good</Option>
                      <Option value="fair">Fair</Option>
                      <Option value="poor">Poor</Option>
                    </Select>
                  </Form.Item>
                ))}
              </div>
            </section>

            {/* Section 3: Additional Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Additional information</h2>
              <Form.Item label="Upload photos" name="photos">
                <Dragger 
                  multiple 
                  maxCount={3} 
                  className="bg-[#111] border-gray-700 hover:border-green-500"
                >
                  <p className="ant-upload-drag-icon flex justify-center mb-4">
                    <span className="p-3 bg-green-500/10 rounded-full border border-green-500 inline-block">
                      <UploadIcon className="text-green-500" size={24} />
                    </span>
                  </p>
                  <p className="text-white text-lg font-semibold">Click to select</p>
                  <p className="text-gray-500 text-sm mt-2">Maximum of 3 photos</p>
                </Dragger>
              </Form.Item>

              <Form.Item label="Additional disclosures / notes" name="notes">
                <Input.TextArea rows={6} className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500" />
              </Form.Item>
            </section>

          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
}