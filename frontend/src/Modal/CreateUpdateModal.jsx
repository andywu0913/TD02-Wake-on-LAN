import React from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { Check2, Diagram3Fill, HddNetworkFill, PersonBadge } from 'react-bootstrap-icons';

import { Formik } from 'formik';
import PropTypes from 'prop-types';

function createModal(props) {
  const { show, id, name, macAddress, port, handleSubmit, hideModal } = props;
  return (
    <Modal show={show} onHide={hideModal} size="md" centered>
      <Formik
        initialValues={{ id, name, macAddress, port }}
        validate={handleValidation}
        onSubmit={(values, actions) => handleSubmit(values, () => actions.setSubmitting(false))}
        enableReinitialize
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          dirty,
          touched,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">{id ? '修改' : '新增'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form.Group>
                <Form.Label>暱稱</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="為這個裝置取個暱稱吧"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && !!errors.name}
                  />
                  {errors.name && <Form.Control.Feedback type="invalid" tooltip>{errors.name}</Form.Control.Feedback>}
                  <InputGroup.Append>
                    <InputGroup.Text><PersonBadge /></InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.Label>MAC位址</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    name="macAddress"
                    type="text"
                    placeholder="裝置的MAC位址 (E.g. 11:22:33:44:55:66)"
                    value={values.macAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.macAddress && !!errors.macAddress}
                  />
                  {errors.macAddress && <Form.Control.Feedback type="invalid" tooltip>{errors.macAddress}</Form.Control.Feedback>}
                  <InputGroup.Append>
                    <InputGroup.Text><HddNetworkFill /></InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.Label>接收開機訊號的Port&nbsp;<small>(大部份裝置是9，但也有可能是7或0)</small></Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    name="port"
                    type="text"
                    placeholder="裝置接收開機訊號的Port (E.g. 9)"
                    value={values.port}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.port && !!errors.port}
                  />
                  {errors.port && <Form.Control.Feedback type="invalid" tooltip>{errors.port}</Form.Control.Feedback>}
                  <InputGroup.Append>
                    <InputGroup.Text><Diagram3Fill /></InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" disabled={!dirty || isSubmitting} block>
                <Check2 />&nbsp;保存
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

function handleValidation(values) {
  const macAddressRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/i;
  const portRegex = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;

  const errors = {};

  if (!values.name) errors.name = '必填';
  else if (values.name.length > 32) errors.name = '暱稱格式錯誤';

  if (!values.macAddress) errors.macAddress = '必填';
  else if (!macAddressRegex.test(values.macAddress)) errors.macAddress = 'MAC位址格式錯誤';

  if (!values.port) errors.port = '必填';
  else if (!portRegex.test(values.port)) errors.port = 'Port格式錯誤';

  return errors;
}

createModal.propTypes = {
  show: PropTypes.bool,
  id: PropTypes.number,
  name: PropTypes.string,
  macAddress: PropTypes.string,
  port: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleSubmit: PropTypes.func,
  hideModal: PropTypes.func,
};

createModal.defaultProps = {
  show: false,
  id: null,
  name: '',
  macAddress: '',
  port: '',
  handleSubmit: () => {},
  hideModal: () => {},
};

export default createModal;
