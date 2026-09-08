import { useState } from 'react';
import { Form, Input, Select, Upload, ConfigProvider, theme, Button, message, Modal, Checkbox } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';
import { submitVehicleListing, uploadVehicleFile } from '../api';
import { trackEvent } from '../analytics';

const { Option } = Select;
const { Dragger } = Upload;

export default function SubmitVehicle() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [pendingValues, setPendingValues] = useState<Record<string, unknown> | null>(null);

  const openConfirmModal = (values: Record<string, unknown>) => {
    setPendingValues(values);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    if (isSubmitting) return;
    setIsConfirmOpen(false);
    setAgreedToTerms(false);
  };

  const handleConfirmedSubmit = async () => {
    if (!pendingValues) return;
    const values = pendingValues;
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
      const exteriorCondition = String(values.exterior_condition ?? '');
      const interiorCondition = String(values.interior_condition ?? '');
      const mechanicalCondition = String(values.mechanical_condition ?? '');
      const tireCondition = String(values.tires ?? '');
      const warningLight = String(values.warning_lights___dashboard_lights ?? '');
      const interiorOdor = String(values.interior_odor ?? '');

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
        titleStatus: values.titleStatus,
        minimumAcceptablePrice,
        trim: values.trim,
        exteriorColor: values.exteriorColor,
        interiorColor: values.interiorColor,
        smokerVehicle: interiorOdor.toLowerCase().includes('smoker'),
        exteriorCondition,
        interiorCondition,
        mechanicalCondition,
        tireCondition,
        engine: values.engine,
        leatherOrCloth: values.leatherCloth,
        roof: values.roof,
        drivetrain: values.drivetrain,
        transmission: values.transmission,
        accidentHistory: values.accidentHistory,
        additionalDisclosures: values.notes,
        uploads: uploadIds,
      });

      trackEvent('generate_lead', { lead_type: 'vehicle_submission' });
      message.success('Vehicle submitted successfully. It will appear in the admin vehicle table after review.');
      form.resetFields();
      setIsConfirmOpen(false);
      setAgreedToTerms(false);
      setPendingValues(null);
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
          <Form form={form} layout="vertical" size="large" className="space-y-12" onFinish={openConfirmModal}>
            
            {/* Section 1: Vehicle Information */}
            <section>
              <h2 className="text-2xl font-bold text-green-500 mb-6">Vehicle Information</h2>
              <div className="space-y-4">
                <Form.Item label="Seller Name" name="name" rules={[{ required: true, message: 'Seller Name is required' }]}>
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
                <Form.Item label="Title Status" name="titleStatus" rules={[{ required: true, message: 'Title status is required' }]}>
                  <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                    <Option value="IN_HAND">In Hand</Option>
                    <Option value="LIEN">Lien</Option>
                  </Select>
                </Form.Item>
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
                {['Exterior Condition', 'Interior Condition', 'Mechanical Condition', 'Tires', 'Warning Lights / Dashboard Lights'].map((field) => (
                  <Form.Item key={field} label={field} name={field.toLowerCase().replace(/\s+/g, '_').replace(/[\/]/g, '_')} rules={[{ required: true, message: `${field} is required` }]}> 
                    <Input.TextArea
                      rows={1}
                      placeholder={
                        {
                          'Exterior Condition': 'Minor scratch on bumper',
                          'Interior Condition': 'Minor tear on the seat',
                          'Mechanical Condition': 'Engine runs smooth',
                          Tires: '40% thread remaining',
                          'Warning Lights / Dashboard Lights': 'Check engine light',
                        }[field]
                      }
                      className="border-gray-700 bg-[#111] text-white hover:border-green-500 focus:border-green-500"
                    />
                  </Form.Item>
                ))}
              </div>
              <div>
                 <Form.Item label="Interior Odor" name="interior_odor" rules={[{ required: true, message: 'Interior odor is required' }]}> 
                    <Select className="w-full border-gray-700 bg-[#111] text-white" popupClassName="bg-[#111]">
                      <Option value="smoker">Smoker</Option>
                      <Option value="none">None</Option>
                      <Option value="other">Other options</Option>
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

              <Form.Item className="text-right mb-2">
                <Button htmlType="submit" type="primary" size="large" className="bg-green-600 border-green-600 hover:bg-green-500">
                  Submit
                </Button>
              </Form.Item>
            </section>

          </Form>
        </ConfigProvider>
      </div>

      <Modal
        centered
        open={isConfirmOpen}
        footer={null}
        closable={!isSubmitting}
        maskClosable={!isSubmitting}
        onCancel={closeConfirmModal}
        width={480}
        className="[&_.ant-modal-content]:!bg-[#111] [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:border [&_.ant-modal-content]:!border-gray-700 [&_.ant-modal-content]:p-8 [&_.ant-modal-close]:!text-white"
      >
        <h3 className="mb-4 text-lg font-bold text-white">Confirm Submission</h3>
        <p className="mb-6 text-sm leading-relaxed text-black">
          By submitting your information, you agree to Lane16&rsquo;s{' '}
          <a href="/#/terms" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Terms of Use</a>
          {' '}and acknowledge the{' '}
          <a href="/#/privacy" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Privacy Policy</a>.
        </p>
        <style>{`
          .consent-checkbox .ant-checkbox {
            --ant-control-interactive-size: 22px !important;
            border-width: 2px !important;
            border-color: #9ca3af !important;
          }
          .consent-checkbox .ant-checkbox-checked {
            background-color: #22c55e !important;
            border-color: #9ca3af !important;
          }
          .consent-checkbox span {
            color: #000;
          }
        `}</style>
        <Checkbox
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="consent-checkbox mb-6"
        >
          I agree to the Terms of Use and acknowledge the Privacy Policy.
        </Checkbox>
        <div className="flex justify-end gap-3">
          <Button onClick={closeConfirmModal} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="primary"
            disabled={!agreedToTerms}
            loading={isSubmitting}
            onClick={handleConfirmedSubmit}
            className="bg-green-600 border-green-600 hover:bg-green-500"
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
}
