import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { HddNetwork, Lightning, PencilSquare, PlugFill, TrashFill } from 'react-bootstrap-icons';

import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';

import BackendURL from 'BackendURL';

export default function MainPage() {
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);

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
          const { error_msg: message = '' } = error.response.data;
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }, [needReload]);

  // function updateUser(userObj) {
  //   setUserObj(userObj);
  //   setShowUpdateUserModal(true);
  // }

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
        swal.fire({ icon: 'success', title: response.data || 'Success', showConfirmButton: false, timer: 1500 })
          .then(() => setTimeout(() => setNeedReload(true), 200));
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const message = error.response.data || '';
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  function handleDelete(name, id) {
    swal.fire({
      title: `確認要刪除 ${name} 的裝置記錄?`,
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
      swal.showLoading();
      axios.delete(`${BackendURL}/address/${id}`)
        .then((response) => {
          swal.fire({ icon: 'success', title: response.data || 'Success', showConfirmButton: false, timer: 1500 })
            .then(() => setTimeout(() => setNeedReload(true), 200));
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const message = error.response.data || '';
            swal.fire({ icon: 'error', title: 'Error', text: message });
            return;
          }
          swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
        });
    });
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
          <Button variant="outline-info" className="mr-3 mt-3 text-nowrap">
            <HddNetwork size="1.25rem" />&nbsp;新增MAC位址
          </Button>
          <Button variant="outline-success" className="mt-3 text-nowrap" onClick={() => handleWakeUp()}>
            <PlugFill size="1.25rem" />&nbsp;發送開機訊號至所有裝置
          </Button>
          <hr />
        </Col>
      </Row>
      <Table striped bordered hover responsive style={{ color: '#505050' }}>
        <thead>
          <tr className="text-center text-nowrap">
            <th>暱稱</th>
            <th>MAC位址</th>
            <th>port</th>
            <th>創建時間</th>
            <th>最後修改時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody className="text-center text-nowrap">
          {data.map((user) => {
            const createTime = user.createTime ? moment(user.createTime).format('lll') : null;
            const updateTime = user.updateTime ? moment(user.updateTime).format('lll') : null;
            return (
              <tr key={user.id}>
                <td className="align-middle text-nowrap">{user.name}</td>
                <td className="align-middle text-nowrap">{user.macAddress}</td>
                <td className="align-middle text-nowrap">{user.port}</td>
                <td className="align-middle text-nowrap">{createTime}</td>
                <td className="align-middle text-nowrap">{updateTime}</td>
                <td className="align-middle text-nowrap">
                  <Button variant="success" className="mr-2 text-nowrap" size="sm" onClick={() => handleWakeUp(user.id)}>
                    <Lightning size="1.25rem" />&nbsp;發送開機訊號
                  </Button>
                  <Button variant="info" className="mr-2 text-nowrap" size="sm">
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
    </Container>
  );
}
