import closest      from 'polyshim/shim/closest';
import objectAssign from 'polyshim/shim/object-assign';
import CustomEvent  from 'polyshim/shim/custom-event';
import ExtraEvents  from './src';

ExtraEvents.setShim(closest, objectAssign, CustomEvent);

export default ExtraEvents;