
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { FileUploadService } from './file-upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileUploadComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let fileUploadService: jasmine.SpyObj<FileUploadService>;

  beforeEach(() => {
    const fileUploadServiceSpy = jasmine.createSpyObj('FileUploadService', ['compareFiles']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule ],
      declarations: [AppComponent],
      providers: [{ provide: FileUploadService, useValue: fileUploadServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fileUploadService = TestBed.inject(FileUploadService) as jasmine.SpyObj<FileUploadService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form inputs', () => {
    expect(component.fileForm.valid).toBeFalse();
    component.fileForm.controls['file1'].setValue(new File([], 'test.txt'));
    component.fileForm.controls['file2'].setValue(new File([], 'test.txt'));
    expect(component.fileForm.valid).toBeTrue();
  });

  it('should call compareFiles on submit', () => {
    component.fileForm.controls['file1'].setValue(new File([], 'test.txt'));
    component.fileForm.controls['file2'].setValue(new File([], 'test.txt'));
    fileUploadService.compareFiles.and.returnValue(of({ result: 'files are similar' }));

    component.onSubmit();

    expect(fileUploadService.compareFiles).toHaveBeenCalled();
    expect(component.responseMessage).toEqual(JSON.stringify({ result: 'files are similar' }));
  });

  it('should handle errors gracefully', () => {
    component.fileForm.controls['file1'].setValue(new File([], 'test.txt'));
    component.fileForm.controls['file2'].setValue(new File([], 'test.txt'));
    fileUploadService.compareFiles.and.returnValue(throwError({ error: { message: 'API error' } }));

    component.onSubmit();

    expect(component.errorMessage).toEqual('API error');
    expect(component.responseMessage).toBeNull();
  });
});
