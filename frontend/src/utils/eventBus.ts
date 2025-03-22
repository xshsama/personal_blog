import mitt from 'mitt';

type Events = {
    'auth:error': void;
}

const eventBus = mitt<Events>();

export default eventBus;