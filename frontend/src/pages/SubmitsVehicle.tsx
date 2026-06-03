import React from 'react';
import { Form, Input, Select, Upload, ConfigProvider, theme, Button } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';

const { Option } = Select;
const { Dragger } = Upload;

export default function SubmitVehicle() {
  const handleSubmit = (values: Record<string, any>) => {
    console.log('Submit Vehicle form values:', values);
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-24">
      <div className="bg-[#111] py-16 text-center border-b border-gray-800 mb-12">
        <h1 className="text-5xl font-bold text-white">Submit Vehicle</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#22c55e', colorBgContainer: '#111' } }}>
          <Form layout="vertical" size="large" requiredMark={false} className="space-y-12" onFinish={handleSubmit}>
            
            {/* Section 1: Vehicle Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Vehicle Information</h2>
              <div className="space-y-4">
                <Form.Item label="Name" name="name">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Enter a valid email' }]}>
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phoneNumber">
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="City" name="city">
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="State" name="state">
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <Form.Item label="VIN" name="vin">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item label="Year" name="year"><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                  <Form.Item label="Make" name="make"><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                  <Form.Item label="Model" name="model"><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Trim" name="trim">
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="Engine" name="engine">
                    <Input placeholder="ex. 2.5L 4 cyl" className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Exterior Color" name="exteriorColor">
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="Interior Color" name="interiorColor">
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Leather / Cloth" name="leatherCloth">
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="leather">Leather</Option>
                      <Option value="cloth">Cloth</Option>
                      <Option value="mixed">Mixed</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Roof" name="roof">
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="sunroof">Sunroof</Option>
                      <Option value="hardtop">Hardtop</Option>
                      <Option value="softtop">Softtop</Option>
                      <Option value="none">None</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Drivetrain" name="drivetrain">
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="awd">AWD</Option>
                      <Option value="rwd">RWD</Option>
                      <Option value="fwd">FWD</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Transmission" name="transmission">
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="automatic">Automatic</Option>
                      <Option value="manual">Manual</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item label="Mileage" name="mileage">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                <Form.Item label="Title status" name="titleStatus">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                <Form.Item label="Minimum Acceptable Price" name="minimumAcceptablePrice">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                {/* <Form.Item label="Payoff/lien information" name="payoff">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item> */}
              </div>
            </section>

            {/* Section 2: Condition Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Condition information</h2>
              <div className="space-y-4">
                {['Exterior', 'Mechanical / Warning', 'Tires', 'Warning light'].map((field) => (
                  <Form.Item key={field} label={field} name={field.toLowerCase().replace(/\s+/g, '_').replace(/[\/]/g, '_')}>
                    {/* <Select placeholder="Click to select" className="w-full" popupClassName="bg-[#111]">
                      <Option value="excellent">Excellent</Option>
                      <Option value="good">Good</Option>
                      <Option value="fair">Fair</Option>
                      <Option value="poor">Poor</Option>
                    </Select> */}
                    <Input.TextArea
                      rows={1}
                      placeholder={
                        {
                          Exterior: 'Minor scratch on bumper',
                          'Mechanical / Warning': 'Minor cut on the seat',
                          Tires: '40% thread remaining',
                          'Smoker vehicle': 'Smoker odor present',
                          'Warning light': 'Check engine light ',
                        }[field]
                      }
                      className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500"
                    />
                  </Form.Item>
                ))}
              </div>
              <div>
                 <Form.Item label="Interior Odor" name="Interior Odor">
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="smoker">Smoker</Option>
                      <Option value="none">None</Option>
                      <Option value="option">Other options</Option>
                    </Select>
                  </Form.Item>
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
                  <p className="text-gray-500 text-sm mt-2"></p>
                </Dragger>
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Form.Item label="Accident History" name="accidentHistory">
  <Input.TextArea
    rows={3}
    placeholder="Describe any accident history or damage here"
    className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500"
  />
</Form.Item>
                <Form.Item label="Interior Odor" name="interiorOdor">
                  <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                    <Option value="none">None</Option>
                    <Option value="smoker">Smoker</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item label="Additional disclosures / notes" name="notes">
                <Input.TextArea rows={6} className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500" />
              </Form.Item>

              <Form.Item className="text-right">
                <Button htmlType="submit" type="primary" size="large" className="bg-green-600 border-green-600 hover:bg-green-500">
                  Submit
                </Button>
              </Form.Item>
            </section>

          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
}
