import React, { useState } from 'react';
import {
  Container,
  Site,
  Header,
  Grid,
  Card,
  Form,
  Button,
  Text,
  Table,
  Alert,
} from 'tabler-react';

function App() {
  const [time, setTime] = useState(180);
  const [entry, setEntry] = useState(0);
  const [service, setService] = useState(0);
  const [timeEntries, setTimeEntries] = useState([10, 12, 15]);
  const [timeServices, setTimeServices] = useState([9, 10, 11]);
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({});
  const [showResult, setShowResult] = useState(false);

  function sortNumber(a, b) {
    return a - b;
  }

  function isInteger(value) {
    try {
      const number = parseInt(value, 10);
      if (Number.isInteger(number)) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function getRandomNumber(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function addEntry() {
    if (!isInteger(entry)) return;
    if (timeEntries.includes(parseInt(entry, 10))) return;

    setTimeEntries((times) => [...times, parseInt(entry, 10)].sort(sortNumber));
    setEntry(0);
  }

  function addService() {
    if (!isInteger(service)) return;
    if (timeServices.includes(parseInt(service, 10))) return;

    setTimeServices((times) =>
      [...times, parseInt(service, 10)].sort(sortNumber)
    );
    setService(0);
  }

  function defineTotals(arr) {
    const results = {
      serviceTime: arr.reduce((acc, cur) => acc + cur.service, 0),
      queueTime: arr.reduce((acc, cur) => acc + cur.queueTime, 0),
      clientTime: arr.reduce((acc, cur) => acc + cur.timeSystem, 0),
      freeTime: arr.reduce((acc, cur) => acc + cur.freeTime, 0),
      clientsOnQueue: arr.filter((elm) => elm.queueTime > 0).length || 0,
    };

    setTotals(results);
  }

  function calculate() {
    if (!Number.isInteger(parseInt(time, 10))) {
      alert('O tempo deve ser informado como um número inteiro!');
      return;
    }

    if (timeEntries.length <= 1 || timeServices.length <= 1) {
      alert('TEC e TS devem possuir, ao menos, 2 opções!');
      return;
    }

    let prevIndex = 0;
    let counter = 1;
    const records = [];

    const randomTEC = getRandomNumber(timeEntries);
    const randomTS = getRandomNumber(timeServices);
    const queueTime = 0;
    records.push({
      num: counter,
      entry: randomTEC,
      entryInClock: randomTEC,
      service: randomTS,
      startService: randomTEC,
      queueTime,
      final: randomTS + randomTEC,
      timeSystem: randomTS + queueTime,
      freeTime: randomTEC,
    });

    while (true) {
      const num = counter + 1;
      const newTEC = getRandomNumber(timeEntries);
      const newTS = getRandomNumber(timeServices);
      const entryInClock = records[prevIndex].entryInClock + newTEC;
      const newQueueTime =
        records[prevIndex].final >= entryInClock
          ? records[prevIndex].final - entryInClock
          : 0;
      const startService = entryInClock + newQueueTime;
      const final = newTS + startService;
      const timeSystem = newTS + newQueueTime;
      const freeTime =
        records[prevIndex].final < entryInClock
          ? entryInClock - records[prevIndex].final
          : 0;

      if (entryInClock > time) {
        break;
      } else {
        records.push({
          num,
          entry: newTEC,
          entryInClock,
          service: newTS,
          startService,
          queueTime: newQueueTime,
          final,
          timeSystem,
          freeTime,
        });

        counter += 1;
        prevIndex += 1;
      }
    }

    defineTotals(records);
    setRows(records);
    setShowResult(true);
  }

  function clear() {
    setTime(0);
    setEntry(0);
    setService(0);
    setTimeEntries([]);
    setTimeServices([]);
    setRows([]);
    setShowResult(false);
  }

  return (
    <>
      <Site.Header align="center">
        <Header.H3>TABELA DE SIMULAÇÃO - {time} minutos</Header.H3>
      </Site.Header>
      <Container>
        <Alert type="primary" hasExtraSpace>
          <strong>Recomendações:</strong> são permitidos apenas números inteiros
          e únicos. Portanto, insira apenas valores númericos e não os repita!
        </Alert>
        <Grid.Row alignItems="center" className="time-and-button">
          <Grid.Col width={4} offset={2}>
            <Form.Input
              label="INFORME O TEMPO DA SIMULAÇÃO"
              autoFocus
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col width={4}>
            <Button.List>
              <Button block pill color="primary" onClick={calculate}>
                SIMULAR
              </Button>
              <Button block pill color="warning" onClick={clear}>
                LIMPAR
              </Button>
            </Button.List>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row cards deck>
          <Grid.Col>
            <Card title="Tempo Entre Chegadas (TEC)">
              <Container className="spacing">
                <Form.InputGroup>
                  <Form.Input
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addEntry();
                      }
                    }}
                  />
                  <Form.InputGroupAppend>
                    <Button icon="plus" color="primary" onClick={addEntry} />
                  </Form.InputGroupAppend>
                </Form.InputGroup>
                <hr />
                <Text color="success" center="true" className="options">
                  {timeEntries.map((item, i) => (
                    <span key={item}>{i === 0 ? item : ` | ${item}`}</span>
                  ))}
                </Text>
              </Container>
            </Card>
          </Grid.Col>
          <Grid.Col>
            <Card title="Tempo de Serviço (TS)">
              <Container className="spacing">
                <Form.InputGroup>
                  <Form.Input
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addService();
                      }
                    }}
                  />
                  <Form.InputGroupAppend>
                    <Button icon="plus" color="primary" onClick={addService} />
                  </Form.InputGroupAppend>
                </Form.InputGroup>
                <hr />
                <Text color="success" center="true" className="options">
                  {timeServices.map((item, i) => (
                    <span key={item}>{i === 0 ? item : ` | ${item}`}</span>
                  ))}
                </Text>
              </Container>
            </Card>
          </Grid.Col>
        </Grid.Row>
        {showResult && (
          <>
            <Grid.Row alignItems="center">
              <Table>
                <Table.Header>
                  <Table.ColHeader>Cliente</Table.ColHeader>
                  <Table.ColHeader>
                    Tempo desde a última chegada (minutos)
                  </Table.ColHeader>
                  <Table.ColHeader>Tempo de Chegada no Relógio</Table.ColHeader>
                  <Table.ColHeader>Tempo de Serviço (minutos)</Table.ColHeader>
                  <Table.ColHeader>
                    Tempo de Início do Serviço no Relógio
                  </Table.ColHeader>
                  <Table.ColHeader>
                    Tempo do Cliente na Fila (minutos)
                  </Table.ColHeader>
                  <Table.ColHeader>
                    Tempo Final do Serviço no Relógio
                  </Table.ColHeader>
                  <Table.ColHeader>
                    Tempo do Cliente no Sistema (minutos)
                  </Table.ColHeader>
                  <Table.ColHeader>
                    Tempo Livre do Operador (minutos)
                  </Table.ColHeader>
                </Table.Header>
                <Table.Body>
                  {rows.map((row) => (
                    <Table.Row key={row.num}>
                      <Table.Col>{row.num}</Table.Col>
                      <Table.Col>{row.entry}</Table.Col>
                      <Table.Col>{row.entryInClock}</Table.Col>
                      <Table.Col>{row.service}</Table.Col>
                      <Table.Col>{row.startService}</Table.Col>
                      <Table.Col>{row.queueTime}</Table.Col>
                      <Table.Col>{row.final}</Table.Col>
                      <Table.Col>{row.timeSystem}</Table.Col>
                      <Table.Col>{row.freeTime}</Table.Col>
                    </Table.Row>
                  ))}
                  <Table.Row key="totals">
                    <Table.Col />
                    <Table.Col />
                    <Table.Col />
                    <Table.Col>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        {totals.serviceTime}
                      </span>
                    </Table.Col>
                    <Table.Col />
                    <Table.Col>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        {totals.queueTime}
                      </span>
                    </Table.Col>
                    <Table.Col />
                    <Table.Col>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        {totals.clientTime}
                      </span>
                    </Table.Col>
                    <Table.Col>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        {totals.freeTime}
                      </span>
                    </Table.Col>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Row>
            <Grid.Row cards deck>
              <Card title="RESULTADOS">
                <Container className="spacing">
                  <Grid.Row>
                    <Grid.Col>
                      Tempo médio de espera na fila{' '}
                      <Text className="bold" color="primary">
                        {`${(totals.queueTime / rows.length).toFixed(
                          2
                        )} minutos`}
                      </Text>
                    </Grid.Col>
                    <Grid.Col>
                      Probabilidade de um cliente esperar na fila{' '}
                      <Text className="bold" color="primary">
                        {`${(totals.clientsOnQueue / rows.length).toFixed(
                          2
                        )} %`}
                      </Text>
                    </Grid.Col>
                    <Grid.Col>
                      Probabilidade do operador livre{' '}
                      <Text className="bold" color="primary">
                        {`${(
                          totals.freeTime / rows[rows.length - 1].final
                        ).toFixed(2)} %`}
                      </Text>
                    </Grid.Col>
                    <Grid.Col>
                      Tempo médio de serviço{' '}
                      <Text className="bold" color="primary">
                        {`${(totals.serviceTime / rows.length).toFixed(
                          2
                        )} minutos`}
                      </Text>
                    </Grid.Col>
                    <Grid.Col>
                      Tempo médio despendido no sistema{' '}
                      <Text className="bold" color="primary">
                        {`${(totals.clientTime / rows.length).toFixed(
                          2
                        )} minutos`}
                      </Text>
                    </Grid.Col>
                  </Grid.Row>
                </Container>
              </Card>
            </Grid.Row>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
