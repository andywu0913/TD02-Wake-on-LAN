import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { BroadcastPin, CloudCheck, CloudSlash, Cursor, HddNetwork, Lightning, PencilSquare, PlugFill, TrashFill } from 'react-bootstrap-icons';

import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';

import CreateUpdateModal from 'SRC/Modal/CreateUpdateModal';

import BackendURL from 'BackendURL';

export default function MainPage() {
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);
  const [showCreateUpdateModal, setShowCreateUpdateModal] = useState(false);
  const [userObj, setUserObj] = useState({});
  const [handleModalSubmit, setHandleModalSubmit] = useState(() => () => {});

  useEffect(() => {
    if (!needReload) {
      return;
    }
    swal.showLoading();
    axios.get(`${BackendURL}/address`)
      .then((response) => {
        setData(response.data || []);
        setNeedReload(false);
        setTimeout(() => swal.close(), 500);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }, [needReload]);

  function handleWakeUp(id) {
    swal.showLoading();

    let url;
    if (id) {
      url = `${BackendURL}/wake/${id}`;
    } else {
      url = `${BackendURL}/wake/all`;
    }

    axios.post(url)
      .then((response) => {
        setTimeout(() => {
          swal.fire({ icon: 'success', title: 'Success', text: response.data, showConfirmButton: false, timer: 1500 });
        }, 400);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  function handleCreate(userObj, callback) {
    swal.showLoading();
    axios.post(`${BackendURL}/address`, userObj)
      .then((response) => {
        setTimeout(() => {
          swal.fire({ icon: 'success', title: 'Success', text: response.data, showConfirmButton: false, timer: 1500 })
            .then(() => setTimeout(() => {
              setShowCreateUpdateModal(false);
              setNeedReload(true);
            }, 200));
        }, 400);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      })
      .finally(() => setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, 400));
  }

  function handleUpdate(userObj, callback) {
    swal.showLoading();
    axios.put(`${BackendURL}/address/${userObj.id}`, userObj)
      .then((response) => {
        setTimeout(() => {
          swal.fire({ icon: 'success', title: 'Success', text: response.data, showConfirmButton: false, timer: 1500 })
            .then(() => setTimeout(() => {
              setShowCreateUpdateModal(false);
              setNeedReload(true);
            }, 200));
        }, 400);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      })
      .finally(() => setTimeout(() => {
        if (typeof callback === 'function') {
          callback();
        }
      }, 400));
  }

  function handleRefreshIPAddress(name, id) {
    swal.fire({
      timer: 8000,
      timerProgressBar: true,
      text: `從 ${name} 的MAC位址獲取IP位址，請稍候`,
      onOpen: () => swal.showLoading(),
      allowOutsideClick: () => !swal.isLoading(),
    });

    axios.get(`${BackendURL}/LAN/refreshIP/${id}`)
      .then((response) => {
        setTimeout(() => {
          swal.fire({ text: response.data, showConfirmButton: false, timer: 2000 })
            .then(() => setTimeout(() => {
              setShowCreateUpdateModal(false);
              setNeedReload(true);
            }, 200));
        }, 400);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  function handlePingIPAddress(name, id) {
    swal.fire({
      timer: 8000,
      timerProgressBar: true,
      text: `Ping ${name} 的IP位址獲取裝置狀態，請稍候`,
      onOpen: () => swal.showLoading(),
      allowOutsideClick: () => !swal.isLoading(),
    });

    axios.get(`${BackendURL}/LAN/ping/${id}`)
      .then((response) => {
        setTimeout(() => {
          swal.fire({ text: response.data, showConfirmButton: false, timer: 2000 })
            .then(() => setTimeout(() => {
              setShowCreateUpdateModal(false);
              setNeedReload(true);
            }, 200));
        }, 400);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  function handleDelete(name, id) {
    swal.fire({
      title: 'Delete',
      text: `確認要刪除 ${name} 的裝置記錄?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      swal.fire({ onOpen: () => swal.showLoading() });
      axios.delete(`${BackendURL}/address/${id}`)
        .then((response) => {
          setTimeout(() => {
            swal.fire({ icon: 'success', title: 'Success', text: response.data, showConfirmButton: false, timer: 1500 })
              .then(() => setTimeout(() => setNeedReload(true), 200));
          }, 400);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            swal.fire({ icon: 'error', title: 'Error', text: error.response.data });
            return;
          }
          swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
        });
    });
  }

  function toggleCreateUpdateModal(userObj) {
    setUserObj(userObj || {});
    if (!userObj) {
      setHandleModalSubmit(() => (userObj, callback) => handleCreate(userObj, callback));
    } else {
      setHandleModalSubmit(() => (userObj, callback) => handleUpdate(userObj, callback));
    }
    setShowCreateUpdateModal(true);
  }

  return (
    <Container className="p-3">
      <Row className="pt-3">
        <Col>
          <h1 style={{ color: '#666666' }}>TD02 內網電腦喚醒工具</h1>
        </Col>
      </Row>
      <Row className="pt-3">
        <Col>
          <Button variant="outline-info" className="mr-3 mt-3 text-nowrap" onClick={() => toggleCreateUpdateModal()}>
            <HddNetwork size="1.25rem" />&nbsp;新增MAC位址
          </Button>
          <Button variant="outline-success" className="mt-3 text-nowrap" onClick={() => handleWakeUp()}>
            <BroadcastPin size="1.25rem" />&nbsp;發送開機訊號至所有裝置
          </Button>
          <hr />
        </Col>
      </Row>
      <Table striped bordered hover responsive style={{ color: '#505050' }}>
        <thead>
          <tr className="text-center text-nowrap">
            <th>暱稱</th>
            <th>MAC位址</th>
            <th>Port</th>
            <th>IP位址</th>
            <th>裝置狀態(Ping)</th>
            <th>創建時間</th>
            <th>最後異動時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody className="text-center text-nowrap">
          {data.map((user) => {
            const createTime = user.createTime ? moment(user.createTime).format('lll') : null;
            const updateTime = user.updateTime ? moment(user.updateTime).format('lll') : null;
            return (
              <tr key={user.id}>
                <td className="text-nowrap">{user.name}</td>
                <td className="text-nowrap">{user.macAddress}</td>
                <td className="text-nowrap">{user.port}</td>
                <td className="text-nowrap">{user.ipAddress}</td>
                <td className="pl-4 text-nowrap text-left">
                  {user.pingTime ? <CloudCheck size="1.75rem" color="#28a746" /> : <CloudSlash size="1.75rem" color="#dc3545" />}
                  &nbsp;
                  {user.pingTime ? <small className="text-success">({user.pingTime}ms)</small> : <small className="text-danger">{user.pingTime}(offline)</small>}
                </td>
                <td className="text-nowrap">{createTime}</td>
                <td className="text-nowrap">{updateTime}</td>
                <td className="text-nowrap">
                  <Button variant="success" className="mr-2 text-nowrap" size="sm" onClick={() => handleWakeUp(user.id)}>
                    <PlugFill size="1.25rem" />&nbsp;發送開機訊號
                  </Button>
                  <Button variant="secondary" className="mr-2 text-nowrap" size="sm" onClick={() => handleRefreshIPAddress(user.name, user.id)}>
                    <Lightning size="1.25rem" />&nbsp;獲取IP位址
                  </Button>
                  <Button variant="secondary" className="mr-2 text-nowrap" size="sm" disabled={!user.ipAddress} onClick={() => handlePingIPAddress(user.name, user.id)}>
                    <Cursor size="1.25rem" />&nbsp;Ping裝置狀態
                  </Button>
                  <Button variant="info" className="mr-2 text-nowrap" size="sm" onClick={() => toggleCreateUpdateModal(user)}>
                    <PencilSquare size="1.25rem" />&nbsp;編輯
                  </Button>
                  <Button variant="danger" className="text-nowrap" size="sm" onClick={() => handleDelete(user.name, user.id)}>
                    <TrashFill size="1.25rem" />&nbsp;刪除
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <CreateUpdateModal
        show={showCreateUpdateModal}
        id={userObj.id}
        name={userObj.name}
        macAddress={userObj.macAddress}
        port={userObj.port}
        handleSubmit={handleModalSubmit}
        hideModal={() => setShowCreateUpdateModal(false)}
      />
    </Container>
  );
}
