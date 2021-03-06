import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Channel } from '../channel';
import { packages } from '../packages';
import { providers } from '../providers';
import { ProvidersService } from '../providers.service';
import { ChannelService } from '../channel.service';
import { PackageService } from '../package.service';
import { ContractService } from '../contract.service';
import { clients } from '../clients';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName: string | undefined;
  headers : HttpHeaders | undefined;
  public channel!: Channel;
  public packages!: packages;
  title: any;
  public channels: Channel[] | undefined;
  public packagess: packages[] | undefined;
  public id: number | undefined ;
  public SelectedPackageId: number | undefined;
  public providerss: providers[] | undefined;
  public clientss: clients[] | undefined;
  public payment: number | undefined;
  constructor(private contractService: ContractService,private providersService: ProvidersService,private channelService: ChannelService,private packageService: PackageService,private modalService: NgbModal, private http: HttpClient) {}
  CloseResult = '';
  ngOnInit(): void {

        let url = 'http://localhost:8080/user';
         this.headers = new HttpHeaders({
            'Authorization': 'Basic ' + sessionStorage.getItem('token')
        });
      
    
    this.getChannels();
    this.getPackages();
    this.getproviders();
    this.getallClients();
    // this.getPackages();
  }

  logout() {
    sessionStorage.setItem('token', '');
}
private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };


  onClickSubmit(data: any) {
  
    this.updateprice( data.providers.id,data.percent);
 }


  public updateprice(id: number, percent: number){
  this.channelService.updateprice(id, percent).subscribe()
  this.getChannels();
  }
  
  public update(channel: Channel){
    this.channelService.update(channel).subscribe(
    (Response: Channel) =>{
      console.log(Response);
    }
    )
    this.getChannels();
    this.getPackages();
  }

  public updatePackages(packages: packages){
    this.getPackages();
    this.packageService.update(packages).subscribe(
    (Response: packages) =>{
      console.log(Response);
    }
    )
   
  }
 public SelectedPackage(contractFormAddPackage: NgForm){
   let packages: packages  = contractFormAddPackage.controls['packagesss'].value;
   this.SelectedPackageId = packages.id;
   alert(this.SelectedPackageId!);
 }
 public onListSend(contractFormAddChannels : NgForm){
  let channel: Channel [] = contractFormAddChannels.controls['channel'].value;
  this.getPackagesbyId(this.SelectedPackageId!);
  for(let i=0; i<channel.length; i++){
    this.addChannelstopackage(this.SelectedPackageId!,channel[i].id, this.packages);
  }
}

  public ping(){
    alert("test");
  }

  public getChannelByid(id: number): void{
    this.channelService.getChannelByid(id).subscribe(
      (response: Channel) => {
        this.channel = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  public getproviders(): void{
    this.providersService.getAllProviders().subscribe(
      (response: providers[]) => {
        this.providerss = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  public getPackagesbyId(id: number): void{
    this.packageService.getPackageByid(id).subscribe(
      (response: packages) => {
        this.packages = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }


  public deleteChannel(id: number) {

    this.channelService.deleteChannel(id).subscribe(
      (response: void) => {
        console.log(response);
        this.getChannels();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public deletePackage(id: number) {

    this.packageService.deletePackage(id).subscribe(
      (response: void) => {
        console.log(response);
        this.getPackages();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    
  }
  
// public getChannelsByPackage(id: number): void{
//   this.channelService.getChannelByPackage(id).subscribe(
//     (response: Channel[]) => {
//       this.channels = response;
//     },
//     (error: HttpErrorResponse) => {
//       alert(error.message);
//     }
//   )
// }



public getPackages(): void{
  this.packageService.getpackages().subscribe(
    (response: packages[]) => {
      this.packagess = response;
    },
    // (error: HttpErrorResponse) => {
    //   alert(error.message);
    // }
  )
}

public getChannels(): void{
  this.channelService.getChannel(this.headers!).subscribe(
    (response: Channel[]) => {
      this.channels = response;
    },
    // (error: HttpErrorResponse) => {
    //   alert(error.message);
    // }
  )
}


public onAddChannel(updateChannel: NgForm): void{
  this.channelService.addChannel(updateChannel.value).subscribe(
    (response: Channel) =>{
      console.log(response);
      this.getChannels;
    },
    (error: HttpErrorResponse) =>{
      alert(error.message);
    }
  );
}
public addChannelstopackage(idAPck: number, idChan: number, packages: packages){
  this.packageService.addChannelsToPackages(idAPck, idChan,packages).subscribe(


  )

}


public addChannelsToPackagesShow(name: number, id: number): void{
  this.packageService.addChannelsToPackagesShow(name,id).subscribe(
    (response: Channel[]) => {
      this.channels = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  )
}

// public onaddChannelsWithPackage(addChannelsWithPackage: NgForm): void{
//   this.packageService.addChannelsToPackages(addFormToPackages.value).subscribe(
//     (response: packages[]) => {
//       this.packagess = response;
//     },
//     (error: HttpErrorResponse) => {
//       alert(error.message);
//     }
//   );
// }

open(content: any) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass : "myCustomModalClass",size: 'lg'}).result.then((result) => {
    this.CloseResult = `Closed with: ${result}`;
  }, (reason) => {
    this.CloseResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

public getChannelsByPackage(id: number): void{
  this.channelService.getChannelByPackage(id).subscribe(
    (response: Channel[]) => {
      this.channels = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  )
}

public getPayments (id: number, name:string){
this.contractService.getPayments(id).subscribe(
  (response: number) => {
    this.payment = response;
    alert(this.payment + "leva have been paid by " + name);
  }
);

}



public getChannelsByCategory(id: string): void{
  this.channelService.getChannelByCategory(id).subscribe(
    (response: Channel[]) => {
      this.channels = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  )
}
public getallClients(): void{
  this.contractService.getAllClients().subscribe(
    (response: clients[]) => {
      this.clientss = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  )
}

public onAddClient(addclient: NgForm): void{
  this.contractService.saveClient(addclient.value).subscribe(
    (response: clients) =>{
      console.log(response);
      
    },
    (error: HttpErrorResponse) =>{
      alert(error.message);
     
    }
  );
}


}



