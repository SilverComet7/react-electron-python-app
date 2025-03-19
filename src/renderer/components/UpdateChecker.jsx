import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';

const UpdateChecker = () => {
    const [visible, setVisible] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const [version, setVersion] = useState('1.0.0');

    useEffect(() => {
        // checkForUpdates();
        console.log('version', version);


        async function setNewVersion() {
            const res = await window.electronAPI.ipcRenderer.invoke('get-version');
            console.log('version', res);
            setVersion(res.version);
        }
        setNewVersion();

    }, []);


    const checkForUpdates = async () => {
        try {
            const response = await fetch('http://localhost:4000/index.json');
            const data = await response.json();

            if (data.success && versionCompare(data.data.version, version) > 0) {
                setUpdateData(data.data);
                setVisible(true);
            } else {
                message.success('已是最新版本');
            }
        } catch (error) {
            console.error('检查更新时出错:', error);
            message.error('检查更新失败');
        }
    };

    const handleUpdate = () => {
        window.electronAPI.ipcRenderer.invoke('win-update', updateData);
        setVisible(false);
    };

    return (
        <div>
            {/* 当前版本号 */}
            <div>当前版本号: {version}</div>
            <Button type="primary" onClick={checkForUpdates}>
                检测更新
            </Button>
            <Modal
                title="更新提示"
                visible={visible}
                onOk={handleUpdate}
                onCancel={() => setVisible(false)}
                okText="更新"
                cancelText="取消"
            >
                <p>{updateData?.message}</p>
            </Modal>
        </div>
    );
};

// 版本比较函数
function versionCompare(newVersion, currentVersion) {
    const newVerArr = newVersion.split('.').map(Number);
    const curVerArr = currentVersion.split('.').map(Number);
    for (let i = 0; i < newVerArr.length; i++) {
        if (newVerArr[i] > curVerArr[i]) return 1;
        if (newVerArr[i] < curVerArr[i]) return -1;
    }
    return 0;
}

export default UpdateChecker; 