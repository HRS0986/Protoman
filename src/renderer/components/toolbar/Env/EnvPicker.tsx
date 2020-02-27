import React from 'react';
import { Select, Button, Icon, Modal, Divider, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../models/AppState';
import { EnvEditor } from './EnvEditor';
import { validateNewEnvName } from '../../../models/Env';
import { createEnv, switchEnv } from './EnvPickerActions';
import { selectEnvNames } from '../../../redux/store';

const { Option } = Select;

const ENV_MODAL_WIDTH = 800;

const EnvPicker: React.FunctionComponent<{}> = ({}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const showModal = (): void => setModalVisible(true);
  const closeModal = (): void => setModalVisible(false);

  const currentEnv = useSelector((s: AppState) => s.currentEnv);
  const envNames = useSelector(selectEnvNames);
  const envList = useSelector((s: AppState) => s.envList);

  const dispatch = useDispatch();

  function checkName(name: string): boolean {
    return validateNewEnvName(name, envNames);
  }

  function createNewEnv(): void {
    const tmpName = 'Env';
    let tmpNameIdx = 1;
    while (!checkName(`${tmpName}${tmpNameIdx}`)) tmpNameIdx++;
    dispatch(createEnv(`${tmpName}${tmpNameIdx}`));
  }

  function handleEnvSwitch(newEnvName: string): void {
    dispatch(switchEnv(newEnvName));
  }

  return (
    <>
      <Button shape="circle-outline" style={{ marginLeft: 4 }} onClick={showModal} disabled>
        <Icon type="setting" />
      </Button>
      <Select
        onSelect={handleEnvSwitch}
        disabled
        value={currentEnv}
        style={{ width: 100 }}
        dropdownRender={(menu): React.ReactNode => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div
              style={{ padding: '4px 8px', cursor: 'pointer' }}
              onMouseDown={(e): void => e.preventDefault()}
              onClick={createNewEnv}
            >
              <Icon type="plus" /> New
            </div>
          </div>
        )}
      >
        {envList.map(([name]) => (
          <Option key={name}>{name}</Option>
        ))}
      </Select>
      {modalVisible ? (
        <Modal visible={modalVisible} footer={null} closable={false} destroyOnClose width={ENV_MODAL_WIDTH}>
          <EnvEditor onCancel={closeModal} />
        </Modal>
      ) : null}
    </>
  );
};

export default EnvPicker;
