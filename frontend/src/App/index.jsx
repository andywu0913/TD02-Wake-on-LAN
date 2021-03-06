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
      text: `??? ${name} ???MAC????????????IP??????????????????`,
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
      text: `Ping ${name} ???IP????????????????????????????????????`,
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
      text: `??????????????? ${name} ????????????????`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '????????????',
      cancelButtonText: '??????',
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
          <h1 style={{ color: '#666666' }}>TD02 ????????????????????????</h1>
        </Col>
      </Row>
      <Row className="pt-3">
        <Col>
          <Button variant="outline-info" className="mr-3 mt-3 text-nowrap" onClick={() => toggleCreateUpdateModal()}>
            <HddNetwork size="1.25rem" />&nbsp;??????MAC??????
          </Button>
          <Button variant="outline-success" className="mt-3 text-nowrap" onClick={() => handleWakeUp()}>
            <BroadcastPin size="1.25rem" />&nbsp;?????????????????????????????????
          </Button>
          <hr />
        </Col>
      </Row>
      <Table striped bordered hover responsive style={{ color: '#505050' }}>
        <thead>
          <tr className="text-center text-nowrap">
            <th>??????</th>
            <th>MAC??????</th>
            <th>Port</th>
            <th>IP??????</th>
            <th>????????????(Ping)</th>
            <th>????????????</th>
            <th>??????????????????</th>
            <th>??????</th>
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
                    <PlugFill size="1.25rem" />&nbsp;??????????????????
                  </Button>
                  <Button variant="secondary" className="mr-2 text-nowrap" size="sm" onClick={() => handleRefreshIPAddress(user.name, user.id)}>
                    <Lightning size="1.25rem" />&nbsp;??????IP??????
                  </Button>
                  <Button variant="secondary" className="mr-2 text-nowrap" size="sm" disabled={!user.ipAddress} onClick={() => handlePingIPAddress(user.name, user.id)}>
                    <Cursor size="1.25rem" />&nbsp;Ping????????????
                  </Button>
                  <Button variant="info" className="mr-2 text-nowrap" size="sm" onClick={() => toggleCreateUpdateModal(user)}>
                    <PencilSquare size="1.25rem" />&nbsp;??????
                  </Button>
                  <Button variant="danger" className="text-nowrap" size="sm" onClick={() => handleDelete(user.name, user.id)}>
                    <TrashFill size="1.25rem" />&nbsp;??????
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
