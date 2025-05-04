import Accordion from 'react-bootstrap/Accordion';
import { TabLabel } from './TabLabels';

function Trifold({top, middle, bottom, label}: {top: JSX.Element, middle: JSX.Element, bottom: JSX.Element, label: TabLabel}) {
  function allLabel(label: TabLabel) {
    return `所有${label.chinese} All ${label.plural}`
  }
  function currentLabel(label: TabLabel) {
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
