import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-hello',
  template: `
    <p id="lib-hello">
      hello works!
    </p>
  `,
  styles: []
})
export class HelloComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
