import { Form,Row,Col,DatePicker,Select,Input,Button } from "antd"
import dayjs from 'dayjs';
const FormHeaderComponent=(props)=>{

    const fecha  = dayjs()
    
  const {tipoAsiento,origen,ubicacion,onCancel,MyForm1,requestTipoCambio,saveData} = props

    return(
      <Form
      name='form-asientas-contables'
      className='form-asientos'
      onFinish={saveData}
      layout={'horizontal'}
      form={MyForm1}
    >
       <Row gutter={6}>
        <Col xs={16} sm={12} md={8}>
          <Form.Item
            name='fecha_contable'
            label='Fecha Contable'
            rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
            initialValue={fecha}
          >
            <DatePicker style={{ width: '100%' }}
              size={'small'} />
          </Form.Item>
        </Col>
        <Col xs={16} sm={12} md={8}>
          <Form.Item
            name='fecha_emision'
            label='Fecha Emision'
            rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
            initialValue={fecha}
          >
            <DatePicker style={{ width: '100%' }}
              format={'YYYY-MM-DD'}
              onCalendarChange={(value)=>requestTipoCambio(value)}
              size={'small'} />
          </Form.Item>
        </Col>
        <Col xs={16} sm={12} md={8}>
          <Form.Item
            name='tipo_asiento'
            label='Tipo de Asiento'
            rules={[{ required: true, message: 'Por favor seleccione asiento' }]}
            
          >
            <Select
            options={tipoAsiento}
            size='small'
            />
          </Form.Item>
        </Col>
        <Col xs={20} sm={15} md={8}>
          <Form.Item
            name='origen'
            label='Origen'
            rules={[{ required: true, message: 'Por favor seleccione un origen' }]}
          >
            <Select
              size={'small'}
              allowClear
              options={origen}
              optionRender={(row) => (
                <div key={row.id} style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
              )}

            />
          </Form.Item>
        </Col>
        <Col xs={16} sm={12} md={4}>
          <Form.Item
            name='dias'
            label='Dias'
            rules={[{ required: true, message: 'Ingrese un numero de dia por favor' }]}
          >
            <Input placeholder='Ej:' size='small' />
          </Form.Item>
        </Col>
        <Col xs={16} sm={12} md={8}>
          <Form.Item
            name='ubicacion'
            label='Ubicacion'
            rules={[{ required: true, message: 'Por favor seleccione una ubicacion' }]}
          >
            <Select
              options={ubicacion}
              size={'small'}
            />
          </Form.Item>
        </Col>
        
      </Row>
      <Row>
        <Col xs={20} sm={15} md={10}>
            <Form.Item
              name='observacion'
              label={<span>Obs/Glosa</span>}
              rules={[{ message: 'Por favor  ingrese el numero de deposito' }]}
            >
              <Input
                size={'small'}
                placeholder='Observacion'
              />
            </Form.Item>
        </Col>
      </Row>
      <Row>
      <Button onClick={onCancel} style={{ background: 'green', color: 'white' }} >
          Agregar
        </Button>
        <Button htmlType='submit' style={{ background: 'blue', color: 'white' }}>
          Guardar
        </Button>   
      </Row> 
    </Form>
    )
  }

export default FormHeaderComponent