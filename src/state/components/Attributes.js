import { Component } from 'geotic';
import { Ai } from './Ai';
import { Layer300, Layer400 } from './Layers';
import { IsBlocking, IsDead } from './Status';

export class Defense extends Component {
  static properties = { base: 1, current: 1 };
}

export class Health extends Component {
  static properties = { base: 10, current: 10 };

  onTakeDamage(evt) {
    this.current -= evt.data.amount;

    if (this.current <= 0) {
      if (this.entity.has(Ai)) {
        this.entity.remove(this.entity.ai);
      }
      if (this.entity.has(IsBlocking)) {
        this.entity.remove(this.entity.isBlocking);
      }
      if (this.entity.has(Layer400)) {
        this.entity.remove(this.entity.layer400);
      }

      this.entity.add(IsDead);
      this.entity.add(Layer300);
      this.entity.appearance.char = '%';
    }
    evt.handle();
  }
}

export class Power extends Component {
  static properties = { base: 5, current: 5 };
}
