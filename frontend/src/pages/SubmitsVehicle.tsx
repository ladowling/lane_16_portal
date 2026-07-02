import { useState } from 'react';
import { Form, Input, Select, Upload, ConfigProvider, theme, Button, message } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';
import { submitVehicleListing, uploadVehicleFile } from '../api';

const { Option } = Select;
const { Dragger } = Upload;

export default function SubmitVehicle() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);

    try {
      const photoFiles = Array.isArray(values.photos)
        ? values.photos
            .map((file) => (file && typeof file === 'object' ? (file as { originFileObj?: File }).originFileObj : undefined))
            .filter((file): file is File => Boolean(file))
        : [];
      const uploadIds: string[] = [];
      for (let i = 0; i < photoFiles.length; i++) {
        const uploadId = crypto.randomUUID();
        await uploadVehicleFile(uploadId, photoFiles[i], i + 1);
        uploadIds.push(uploadId);
      }
      const year = Number(values.year);
      const mileage = Number(values.mileage);
      const minimumAcceptablePrice = Number(values.minimumAcceptablePrice);
      const location = [values.city, values.state].filter(Boolean).join(', ');
      const exteriorCondition = String(values.exterior ?? '');
      const mechanicalCondition = String(values.mechanical___warning ?? '');
      const tireCondition = String(values.tires ?? '');
      const warningLight = String(values.warning_light ?? '');
      const interiorOdor = String(values.interiorOdor || values['Interior Odor'] || '');

      await submitVehicleListing({
        vehicleName: `${year || ''} ${values.make || ''} ${values.model || ''}`.trim(),
        sellerName: values.name,
        sellerPhoneNo: values.phoneNumber,
        sellerEmail: values.email,
        vin: values.vin,
        year,
        make: values.make,
        model: values.model,
        mileage,
        location,
        condition: [exteriorCondition, mechanicalCondition, tireCondition, warningLight, interiorOdor]
          .filter(Boolean)
          .join(' | '),
        minimumAcceptablePrice,
        trim: values.trim,
        exteriorColor: values.exteriorColor,
        interiorColor: values.interiorColor,
        smokerVehicle: interiorOdor.toLowerCase().includes('smoker'),
        exteriorCondition,
        mechanicalCondition,
        tireCondition,
        interiorCondition: interiorOdor,
        engine: values.engine,
        leatherOrCloth: values.leatherCloth,
        roof: values.roof,
        drivetrain: values.drivetrain,
        transmission: values.transmission,
        accidentHistory: values.accidentHistory,
        additionalDisclosures: values.notes,
        uploads: uploadIds,
      });

      message.success('Vehicle submitted successfully. It will appear in the admin vehicle table after review.');
      form.resetFields();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Vehicle submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen pb-24">
      <div className="bg-[#111] py-16 text-center border-b border-gray-800 mb-12">
        <h1 className="text-5xl font-bold text-white">Submit Vehicle</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#22c55e', colorBgContainer: '#111' } }}>
          <Form form={form} layout="vertical" size="large" className="space-y-12" onFinish={handleSubmit}>
            
            {/* Section 1: Vehicle Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Vehicle Information</h2>
              <div className="space-y-4">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Enter a valid email' }, { required: true, message: 'Email is required' }]}>
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Phone number is required' }]}>
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="City" name="city" rules={[{ required: true, message: 'City is required' }]}>
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="State" name="state" rules={[{ required: true, message: 'State is required' }]}>
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <Form.Item label="VIN" name="vin" rules={[{ required: true, message: 'VIN is required' }]}>
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Year is required' }]}><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                  <Form.Item label="Make" name="make" rules={[{ required: true, message: 'Make is required' }]}><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                  <Form.Item label="Model" name="model" rules={[{ required: true, message: 'Model is required' }]}><Input className="border-gray-700 hover:border-green-500 focus:border-green-500" /></Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Trim" name="trim" rules={[{ required: true, message: 'Trim is required' }]}> 
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="Engine" name="engine" rules={[{ required: true, message: 'Engine is required' }]}> 
                    <Input placeholder="ex. 2.5L 4 cyl" className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Exterior Color" name="exteriorColor" rules={[{ required: true, message: 'Exterior color is required' }]}> 
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                  <Form.Item label="Interior Color" name="interiorColor" rules={[{ required: true, message: 'Interior color is required' }]}> 
                    <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Leather / Cloth" name="leatherCloth" rules={[{ required: true, message: 'Leather / Cloth selection is required' }]}> 
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="leather">Leather</Option>
                      <Option value="cloth">Cloth</Option>
                      <Option value="mixed">Mixed</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Roof" name="roof" rules={[{ required: true, message: 'Roof selection is required' }]}> 
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="sunroof">Sunroof</Option>
                      <Option value="hardtop">Hardtop</Option>
                      <Option value="softtop">Softtop</Option>
                      <Option value="none">None</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Drivetrain" name="drivetrain" rules={[{ required: true, message: 'Drivetrain selection is required' }]}> 
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="awd">AWD</Option>
                      <Option value="rwd">RWD</Option>
                      <Option value="fwd">FWD</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Transmission" name="transmission" rules={[{ required: true, message: 'Transmission selection is required' }]}> 
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="automatic">Automatic</Option>
                      <Option value="manual">Manual</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item label="Mileage" name="mileage" rules={[{ required: true, message: 'Mileage is required' }]}> 
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item>
                {/* <Form.Item label="Title status" name="titleStatus">
                  <Input className="border-gray-700 hover:border-green-500 focus:border-green-500" />
                </Form.Item> */}
                <Form.Item label="Minimum Acceptable Price" name="minimumAcceptablePrice" rules={[{ required: true, message: 'Minimum acceptable price is required' }]}> 
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
                  <Form.Item key={field} label={field} name={field.toLowerCase().replace(/\s+/g, '_').replace(/[\/]/g, '_')} rules={[{ required: true, message: `${field} is required` }]}> 
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
                 <Form.Item label="Interior Odor" name="Interior Odor" rules={[{ required: true, message: 'Interior odor is required' }]}> 
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
              <Form.Item
                label="Upload photos"
                name="photos"
                rules={[{ required: true, message: 'Please upload photos' }]}
                valuePropName="fileList"
                getValueFromEvent={(event) => (Array.isArray(event) ? event : event?.fileList)}
              > 
                <Dragger 
                  multiple 
                  maxCount={10} 
                  beforeUpload={() => false}
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
               <Form.Item label="Accident History" name="accidentHistory" rules={[{ required: true, message: 'Accident history is required' }]}> 
  <Input.TextArea
    rows={3}
    placeholder="Describe any accident history or damage here"
    className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500"
  />
</Form.Item>
                {/* <Form.Item label="Interior Odor" name="interiorOdor" rules={[{ required: true, message: 'Interior odor is required' }]}> 
                  <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                    <Option value="none">None</Option>
                    <Option value="smoker">Smoker</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item> */}
              </div>

              <Form.Item label="Additional disclosures / notes" name="notes" rules={[{ required: true, message: 'Additional notes are required' }]}> 
                <Input.TextArea rows={6} className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500" />
              </Form.Item>

              <Form.Item className="text-right">
                <Button htmlType="submit" type="primary" size="large" loading={isSubmitting} className="bg-green-600 border-green-600 hover:bg-green-500">
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
