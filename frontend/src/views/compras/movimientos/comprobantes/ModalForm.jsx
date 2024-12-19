import { Modal,InputNumber,Form,Select,Row,Col } from "antd"
import { useState } from "react"
const ModalForm=({openModal,addItem,MyForm2,requestCuentas,cuentas,centroCostos})=>{
    const [blockInput,setBlockInput] = useState('')
    return(
        <Modal
        animation={false}
          title="Registros un nuevo asiento"
          open={open}
          onCancel={openModal}
          footer={null}
  
          width={1000}
        >
          <div>
            <Form
              name='form-asientos'
              className='registrar-asientos'
              form={MyForm2}
              layout="vertical"
              onFinish={addItem}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="cuenta"
                    label="Cuenta"
                    rules={[{ required: true, message: "Por favor seleccione una cuenta" }]}
                  >
                    <Select
                      showSearch
                      onSearch={requestCuentas}
                      allowClear
                      filterOption={false}
                      placeholder='Buscar...'
                    
                      onChange={(_, option) => {
  
                        if (option == undefined) {
                          setBlockInput('')
                        } else {
                          changeCuenta(option)
                        }
                      }}
  
                    >
                      {cuentas.map(item => (
                        <Option key={item.value + '-' + item.moneda} value={item.value}>
                          <div key={item.label} style={{ fontSize: 10 }}>
                            {item.value} - {item.label}
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="moneda"
                    label="Moneda"
                    rules={[{ required: true, message: "Por favor ingrese la moneda" }]}
                    initialValue={'S'}
                  >
                    <Select
                      size='small'
                      placeholder='Seleccione una moneda'
                      options={[{ id: '1', value: "S", label: "S" }, { id: '2', value: 'D', label: 'D' }]}
                      // defaultValue={'S'}
                      disabled={blockInput != ''}
                      onChange={(e) => setBlockInput(e)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="centro_costo"
                    label="Centro de Costo"
                    rules={[{ required: true, message: "Por favor seleccione una cuenta" }]}
                  >
                    <Select
                      showSearch
                      allowClear
                      placeholder='Buscar...'
                      options={centroCostos}
                      notFoundContent={loading ? <Spin size='small' /> : null}
                    />
  
                  </Form.Item>
                </Col>
              </Row>
  
  
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="debe_soles"
                    label="Debe en soles"
                    rules={[{ required: true, message: "Por favor ingrese el monto en soles" }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      disabled={blockInput == '' ? false : blockInput == 'D'}
                      onChange={(value) => clean_input(value, 0)}
  
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="haber_soles"
                    label="Haber en soles"
                    rules={[{ required: true, message: "Por favor ingrese el monto en soles" }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      disabled={blockInput == '' ? false : blockInput == 'D'}
                      onChange={(value) => clean_input(value, 1)}
  
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="debe_dolares"
                    label="Debe en dólares"
                    rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      disabled={blockInput == '' ? false : blockInput == 'S'}
                      onChange={(value) => clean_input(value, 2)}
  
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item
                    name="haber_dolares"
                    label="Haber en dólares"
                    rules={[{ required: true, message: "Por favor ingrese el monto en dólares" }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      disabled={blockInput == '' ? false : blockInput == 'S'}
                      onChange={(value) => clean_input(value, 3)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ justifyContent: 'end' }}>
  
                <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                  <Button style={{ background: 'red', color: 'white' }} type='button' id='btn-cancelar' onClick={() => openModal()}>CANCELAR</Button>
                </Col>
                <Col xs={24} sm={12} md={6} style={{ justifyContent: 'end' }}>
                  <Button style={{ background: 'blue', color: 'white' }} htmlType='submit' id='bn-agregar' type='submit'>AGREGAR</Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
    )
}
export default ModalForm