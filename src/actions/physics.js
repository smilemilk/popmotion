import Action from './';
import { timeSinceLastFrame } from '../framesync';
import { speedPerFrame } from '../inc/calc';

class Physics extends Action {
  static defaultProps = {
    acceleration: 0,
    friction: 0,
    velocity: 0,
    autoStopSpeed: 0.001
  }

  update() {
    const { acceleration, friction, velocity, spring, to } = this.props;
    let newVelocity = velocity;
    const elapsed = timeSinceLastFrame();

    // Apply acceleration to velocity
    if (acceleration) {
      newVelocity += speedPerFrame(acceleration, elapsed);
    }

    // Apply friction to velocity
    if (friction) {
      newVelocity *= (1 - friction) ** (elapsed / 100);
    }

    if (spring && to !== undefined) {
      const distanceToTarget = to - this.current;
      newVelocity += distanceToTarget * speedPerFrame(spring, elapsed);
    }

    // Apply velocity
    this.current += speedPerFrame(newVelocity, elapsed);
    this.props.velocity = newVelocity;

    return this.current;
  }

  isActionComplete() {
    const { autoStopSpeed } = this.props;
    return (!this.velocity || Math.abs(this.velocity) <= autoStopSpeed);
  }
}

export default (props) => new Physics(props);