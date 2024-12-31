import { Form,Col,Row,DatePicker,Select,Input,Checkbox,Button} from "antd"
import dayjs from 'dayjs'
const {TextArea} = Input
const HeaderForm=({MyForm1,saveData,origen,ubicacion,requestProveedor,proveedor,tipoDocument,onCancel,requestTipoCambio})=>{
  const disabledDetracciom=true
  const onChangeCodigoDetraccion=(value)=>{
    if(value!=''){
      MyForm1.setFieldsValue({"detraccion":true})
    }else{
      MyForm1.setFieldsValue({"detraccion":false})

    }
  }
    const fecha = dayjs()
    return(
        <Form
        name='form-asientas-contables'
        className='form-asientos'
        form={MyForm1}
        layout={"horizontal"}
        onFinish={saveData}
      >
        <Row gutter={6}>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='fecha_contable'
              label='Fecha Contable'
              rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              initialValue={fecha}
            >
              <DatePicker style={{ width: '100%' }}
                size={'small'}
                format={'YYYY-MM-DD'}
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='fecha_emision'
              label='Fecha Emision'
              rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              initialValue={fecha}

            >
              <DatePicker style={{ width: '100%' }}
                size={'small'}
                format={'YYYY-MM-DD'}
                onCalendarChange={(value) => requestTipoCambio(value)}

              />

            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='dias'
              label='Dias'
              rules={[{ required: true, message: 'Ingrese un numero de dia por favor' }]}
            >
              <Input placeholder='Ej:' size='small' />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='fecha_vencimiento'
              label='Fecha Vencimiento'
              rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
              initialValue={fecha}
            // format={'YYYY-MM-DD'}

            >
              <DatePicker
                size={'small'}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD'}
              // defaultValue={fecha}


              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='origen'
              label='Origen'
              rules={[{ required: true, message: 'Por favor seleccione un origen' }]}
            >
              <Select
                size={'small'}
                placeholder="Buscar..."
                showSearch
                options={origen}
                optionRender={(row) => (
                  <div style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                )}

              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='ubicacion'
              label='Ubicacion'
              rules={[{ required: true, message: 'Por favor seleccione una ubicacion' }]}
            >
              <Select
                size={'small'}
                placeholder="Buscar..."
                showSearch
                options={ubicacion}
                optionRender={(row) => (
                  <div key={row.id} style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={4} md={4} lg={4}>
            <Form.Item
              name='detraccion'
              label='Detraccion'
              valuePropName="checked"
              initialValue={false}
              
            >
              <Checkbox disabled={disabledDetracciom}
                size={'small'}
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='codigo_detraccion'
              label='C/Det'
              rules={[{ message: 'Por favor ingrese una cuenta' }]}
            >
              <Input
                size={'small'}
                placeholder="Ej:151515"
                onChange={(e)=>onChangeCodigoDetraccion(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='fecha_detraccion'
              label='F/Dep'
              rules={[{ required: true, message: 'Por favor seleccione la fecha de deposito' }]}
              initialValue={fecha}
            >
              <DatePicker
                size={'small'}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD'}
              // defaultValue={fecha}

              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='numero_detraccion'
              label='Nro. Dep.'
              rules={[{ required: true, message: 'Por favor  ingrese el numero de deposito' }]}
            >
              <Input
                size={'small'}
                placeholder='Ej:000-153'
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='observacion'
              label={<span>Obs/Glosa</span>}
              rules={[{ message: 'Por favor  ingrese el numero de deposito' }]}
            >
              <TextArea
                size={'small'}
                placeholder='Observacion'
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='proveedor'
              label="Proveedor"
              rules={[{ message: 'Por favor  ingrese un proveedor' }]}
            >
              <Select
                size={'small'}
                placeholder="Proveedor"
                showSearch
                onSearch={requestProveedor}
                allowClear
                filterOption={false}

              >
                {
                  proveedor.map(item => (
                    <Option key={item.label} value={item.value}>
                      <div style={{ fontSize: 10 }}>
                        {item.value} - {item.label}
                      </div>
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='tipo_documento'
              label="Tipo Doc."
              rules={[{ message: 'Por favor  seleccione un T.P' }]}
            >
              <Select
                size={'small'}
                placeholder="Tipo documento"
                options={tipoDocument}
                optionRender={(row) => (
                  <div key={row.id} style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                )}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='numero_serie'
              label="Serie"
              rules={[{ message: 'Por favor  ingrese la serie' }]}
            >
              <Input
                size={'small'}
                placeholder="Ej:F001"
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='numero_documento'
              label="Nro. Doc."
              rules={[{ message: 'Por favor  ingrese el numero' }]}
            >
              <Input
                size={'small'}
                placeholder="Ej:000001"
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='tipo_doc_referencia'
              label="T.D/REF"
              rules={[{ message: 'Por favor  ingrese el numero' }]}
            >
              <Select
                size={'small'}
                placeholder="Tipo documento"
                options={tipoDocument}
                optionRender={(row) => (
                  <div key={row.id} style={{ fontSize: 10 }}>{row.value} - {row.label}</div>
                )}
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='serie_doc_referencia'
              label="Serie/REF."
              rules={[{ message: 'Por favor  ingrese el numero' }]}
            >
              <Input
                size={'small'}
                placeholder="Ej:000001"
              />
            </Form.Item>
          </Col>
          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='numero_doc_referencia'
              label="Nro/REF."
              rules={[{ message: 'Por favor  ingrese el numero' }]}
            >
              <Input
                size={'small'}
                placeholder="Ej:000001"
              />
            </Form.Item>
          </Col>

          <Col xs={20} md={10} lg={8}>
            <Form.Item
              name='fecha_doc_referencia'
              label='F/REF'
              rules={[{ required: true, message: 'Por favor seleccione la fecha de deposito' }]}
              initialValue={fecha}
            >
              <DatePicker
                size={'small'}
                style={{ width: '100%' }}
                format={'YYYY-MM-DD'}
              // defaultValue={fecha}

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
export default HeaderForm