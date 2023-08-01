import { Component, OnInit } from '@angular/core';
import { TransportService } from './services/transport.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'traduccion';


  selectedFile: File | null = null;
  filename: string = 'Seleccionar archivo';
  sections: Array<any> = [];
  joined: Array<any> = [];
  constructor(
    private transport: TransportService
  ){}

  ngOnInit(): void {
    this.transport.section.subscribe(res=>{
      this.joined.push(res);
    })
    this.transport.index.subscribe(res=>{
      this.sections.splice(res,1);
    })
  }

  onFileSelected(event:any){
    this.selectedFile = event.target.files[0] as File;
    this.updateFileName()
    this.sections = [];
    this.joined = [];
  }
  readFile() {
    if (this.selectedFile) {
      // Crear un objeto FileReader para leer el contenido del archivo
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        // Aquí obtienes el contenido del archivo como texto
        const fileContent = e.target.result;
        let elems = fileContent.split(/\r?\n/);
        for(let i = 0; i < elems.length; i++) {
          if(elems[i] == ''){
            elems.splice(i, 1);
            i--;
          }
        }
        this.sections = [];
        let inside = false;
        let sect = [];
        for(let i = 0; i < elems.length;i++){
          if(elems[i] == '<section>'){
            inside = true;
            sect = []
          }
          else if(elems[i]=='</section>'){
            this.sections.push(sect);
            inside = false;
          }
          else if(inside){
            sect.push(elems[i])
          }
        }
        for(let section of this.sections){
          section[0] = section[0].replace(/#+\s/, '')
          section.splice(1,1)
          section.splice(1,1)
          let temp = [];
          for(let i = 1; i < section.length;i++){
            section [i] = section[i].split('|')
            for(let j = 0; j < section[i].length; j++){
              if((j == 0 || j > 1) && section[i][j] == ''){
                section[i].splice(j, 1)
              }
            }
            temp.push(section[i])
          }
          let title = section[0]
          section.length = 0
          section.push(title, temp)
        }
        console.log(this.sections)
      };

      // Leer el contenido del archivo seleccionado como texto
      fileReader.readAsText(this.selectedFile);
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  }
  updateFileName(){
    if (this.selectedFile){
      this.filename = this.selectedFile.name;
    }
    else{
      this.filename = 'Seleccionar archivo'
    }
  }
  convertir(){
    return new Promise((resolve, reject) => {
      try{
        let txt = '';
        this.transport.exec.next(!this.transport.exec.value);
        for(let section of this.joined){
          txt += '<section>\n\n'
          txt += `## ${section[0]}\n\n`
          txt += `|Español|English|\n|-------|-------|\n`
          for(let row of section[1]){
            txt+= `|${row[0]}|${row[1]}|\n`
          }
          txt += '\n</section>'
          txt += '\n\n'
        }
        resolve(txt);
      }
      catch(err){
        reject(err)
      }
    })
  }
  agregarCategoria(){
    this.sections.push(['',[['','']]])
    console.log(this.sections)
  }
  descargar(){
    this.convertir().then((txt:any) => {
      const blob = new Blob([txt],{type: 'text/plain'});
      const URL = window.URL.createObjectURL(blob);
      let btn = document.getElementById('download') as HTMLAnchorElement
      btn.href = URL.toString()
      btn.download = 'traduccion.md'
      btn.click();
      this.joined = [];
    }).catch((err) => {
      console.log(err)
    })
  }
}
