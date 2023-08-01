import { Component, Input } from '@angular/core';
import { TransportService } from 'src/app/services/transport.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  @Input() seccion:any;
  @Input() index:any;

  constructor(
    private transport:TransportService
  ){}
  ngOnInit() {
    this.transport.exec.subscribe(() => {
      setTimeout(() => {
        this.transport.section.emit(this.seccion);
      }, 2*this.index);
    });
  }
  agregar(){
    this.seccion[1].push(['',''])
  }
  eliminar(index:number){
    this.seccion[1].splice(index,1)
  }
  eliminarCat(){
    this.transport.index.emit(this.index)
  }
}
