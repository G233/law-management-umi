import styles from './index.less';
import { cloudApp, auth } from '@/cloud_function/index';
import { useModel } from 'umi';

import React, { useState } from 'react';
import { Form, Button, Radio, Upload, message, Input, Space } from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  SaveTwoTone,
} from '@ant-design/icons';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormDateRangePicker,
  ProFormRadio,
  ProFormUploadButton,
  ProFormDigit,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

export default function IndexPage() {
  const [imgLoding, setImgLoding] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>();
  const { Divider } = ProCard;
  const { initialState, setInitialState, refresh } = useModel('@@initialState');

  // const handleChange = (info) => {
  //   if (info.file.status === 'uploading') {
  //     setImgLoding(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (imageUrl: string) => {
  //       setImgLoding(true);
  //       setImageUrl(imageUrl);
  //     });
  //   }
  // };
  // const uploadButton = (
  //   <div>
  //     {imgLoding ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  const handleChangePassword = () => {
    const email = initialState?.currentUser?.email;
    auth.sendPasswordResetEmail(email as string).then(() => {
      message.success('重置密码邮件发送成功，请注意查收');
    });
  };

  return (
    <PageContainer>
      <ProCard title="个人资料" headerBordered>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '更新个人信息',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
              style: {
                width: '10rem',
              },
            },
          }}
          onFinish={async (values) => console.log(values)}
        >
          {/* TODO: */}
          {/* <ProForm.Group>
            <Form.Item label="头像">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </ProForm.Group> */}
          <ProForm.Group>
            <ProFormText
              name="name"
              label="姓名"
              tooltip="请输入真实姓名，用于展示"
              placeholder="请输入姓名"
            />
            <ProFormText
              width="md"
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
      <Divider />
      <ProCard title="账户设置" headerBordered>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: '更新绑定邮箱',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
              style: {
                width: '10rem',
              },
            },
          }}
          onFinish={async (values) => console.log(values)}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="email"
              label="绑定邮箱"
              placeholder="请输入邮箱号"
            />
          </ProForm.Group>
        </ProForm>
        <Space>
          <Button
            danger
            className={styles.pwBtn}
            type="primary"
            size="large"
            onClick={handleChangePassword}
          >
            重置密码
          </Button>
        </Space>
      </ProCard>
    </PageContainer>
  );
}
