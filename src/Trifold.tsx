import Accordion from 'react-bootstrap/Accordion';

function Trifold({top, middle, bottom, label}) {
  function allLabel(label) {
    console.log("aaa")
console.log(label)
    return `所有${label.chinese} All ${label.plural}`
  }
  function currentLabel(label) {
    return `當前${label.chinese} Current ${label.singular}`
  }
  return <>
    <Accordion defaultActiveKey={["all", "current"]} alwaysOpen>
      <Accordion.Item eventKey="all">
        <Accordion.Header>{allLabel(label)}</Accordion.Header>
        <Accordion.Body>

          {top}

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="current">
        <Accordion.Header>{currentLabel(label)}</Accordion.Header>
        <Accordion.Body>

          {middle}

        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="administration">
        <Accordion.Header>管理 Administration</Accordion.Header>
        <Accordion.Body>

          {bottom}

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>;
}

export default Trifold;
