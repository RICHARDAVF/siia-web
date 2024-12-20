import { Modal,InputNumber,Form,Select,Row,Col,Button, message } from "antd"
import { useContext, useState } from "react"
import config from "../../../../config"
import { Context } from "../../../../components/GlobalContext"

const ModalForm=({openModal,addItem,MyForm2,centroCostos,onCancel})=>{
    const [blockInput,setBlockInput] = useState('')
    const [cuentas,setCuentas] = useState([])
    const {token,document} = useContext(Context)
    const {BASE_URL} = config
    const requestCuentas = async (value) => {
      try {

          const url = `${BASE_URL}/api/v1/generics/list/cuentas/${document}/`

          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ 'query_string': value })
          })

          const result = await response.json()

          if (result.error) {
              message.error(result.error)
          } else {
              setCuentas(result)
          }

      } catch (err) {
          message.error(err.toString())
      }
  }
    const clean_input = (value, opt) => {
      if (value == undefined) return;
      if (opt == 3) {
        MyForm2.setFieldsValue({
          "debe_dolares": 0
        })
      } else if (opt == 2) {
        MyForm2.setFieldsValue({
          "haber_dolares": 0
        })
      } else if (opt == 1) {
        MyForm2.setFieldsValue({
          "debe_soles": 0
        })
      } else if (opt == 0) {
        MyForm2.setFieldsValue({
          "haber_soles": 0
        })
      }
    }
  const changeCuenta = (value) => {

    const moneda = value.key.split("-")[1]
    MyForm2.setFieldsValue({
        'moneda': moneda,
        "haber_soles": 0,
        "haber_dolares": 0,
        "debe_soles": 0,
        "debe_dolares": 0
    })
    setBlockInput(moneda)
}
  
    return(
        <Modal
        animation={false}
          title="Registros un nuevo asiento"
          open={openModal}
          onCancel={onCancel}
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
                  <Button style={{ background: 'red', color: 'white' }} type='button' id='btn-cancelar' onClick={() => onCancel()}>CANCELAR</Button>
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