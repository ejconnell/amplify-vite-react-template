import Accordion from 'react-bootstrap/Accordion';

function Trifold({top, middle, bottom, singular, plural}) {
  return <>
    <Accordion defaultActiveKey={["all", "current"]} alwaysOpen>
      <Accordion.Item eventKey="all">
        <Accordion.Header>All {plural}</Accordion.Header>
        <Accordion.Body>

          {top}

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="current">
        <Accordion.Header>Current {singular}</Accordion.Header>
        <Accordion.Body>

          {middle}

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="administration">
        <Accordion.Header>Administration</Accordion.Header>
        <Accordion.Body>

          {bottom}

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>;
}

export default Trifold;
