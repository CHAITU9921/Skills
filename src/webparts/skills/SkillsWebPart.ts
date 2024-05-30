import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web }  from 'sp-pnp-js';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


import styles from './SkillsWebPart.module.scss';
import * as strings from 'SkillsWebPartStrings';

export interface ISkillsWebPartProps {
  description: string;
}

export default class SkillsWebPart extends BaseClientSideWebPart<ISkillsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _currentSkillSection: string = 'electrical';
  private currentUserEmail : string ='';
  private userId  : string ='';
  private userName : string = '';
  private empID : string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  public async render(): Promise<void> {
    this.domElement.innerHTML = `
      <div>
        <button id="SkillMatrixVisibility" style="margin: 5px; padding: 10px 20px; background-color: #007acc; color: white; border: none; border-radius: 5px; cursor: pointer;">Skill Matrix Form</button>
      </div>

      <div class="${styles.container}" id="SkillMatrixForm"  style="display: none;" >
        <table class="${styles.legendsTable}">
          <thead>
            <tr>
              <th>Legends</th>
              <th>Competency level</th>
              <th>Job Expectancy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>No knowledge</td>
              <td>Cannot perform the job independently</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Elementary Knowledge</td>
              <td>Cannot perform the job independently</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Average knowledge</td>
              <td>Can perform the job under supervision</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Advanced knowledge</td>
              <td>Can perform the Job independently without any external support</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Professional knowledge</td>
              <td>Can perform the job independently and provide training to others</td>
            </tr>
          </tbody>
        </table>
        <center><h2>Performance Review</h2></center>


      <div id="feedback-form">
        <div class="subskillsContainer">
          <div id="electricalSkills">
            <h2>Electrical Skills</h2>
            <div class="${styles.formGroup}" id="subskill1">
              <label>Understanding Electrical Drawing:</label>
              <div class="rating-container">
                <input type="radio" id="subskill1Rating1" name="subskill1" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill1Rating2" name="subskill1" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill1Rating3" name="subskill1" class="${styles.circleInput}" value="3" /> <span>3</span>
                 <input type="radio" id="subskill1Rating4" name="subskill1" class="${styles.circleInput}" value="4" /> <span>4</span> 
                <input type="radio" id="subskill1Rating5" name="subskill1" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
            </div>
             
            <div class="${styles.formGroup}" id="subskill2">
              <label>Knowledge on Basic Panel Wiring:</label>
              <div class="rating-container">
                <input type="radio" id="subskill2Rating1" name="subskill2" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill2Rating2" name="subskill2" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill2Rating3" name="subskill2" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill2Rating4" name="subskill2" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill2Rating5" name="subskill2" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
               
            </div>
            
            <div class="${styles.formGroup}" id="subskill3">
              <label>Troubleshooting Field Devices with E-plan:</label>
              <div class="rating-container">
                <input type="radio" id="subskill3Rating1" name="subskill3" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill3Rating2" name="subskill3" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill3Rating3" name="subskill3" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill3Rating4" name="subskill3" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill3Rating5" name="subskill3" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
              
            </div>
   
            <div class="${styles.formGroup}" id="KnowSelComp">
              <label>Knowledge of Selecting the Components for the Process:</label>
              <div class="rating-container">
                <input type="radio" id="KnowSelComp1" name="subskill4" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="KnowSelComp2" name="subskill4" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="KnowSelComp3" name="subskill4" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="KnowSelComp4" name="subskill4" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="KnowSelComp5" name="subskill4" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
              </div>

            </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 1 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 10%;"></div>
              </div>
            </div>
            </br>
          </div>
           

          
          <div id="pneumaticsSkills" style="display: none;">
           <h2>Pneumatic Skills</h2>
            <div class="${styles.formGroup}" id="subskill5">
              <label>Understanding Pneumatic Drawing:</label>
              <div class="rating-container">
                <input type="radio" id="subskill5Rating1" name="subskill5" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill5Rating2" name="subskill5" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill5Rating3" name="subskill5" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill5Rating4" name="subskill5" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill5Rating5" name="subskill5" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
            </div>
             
            <div class="${styles.formGroup}" id="subskill6">
              <label>Hands-on Experience in Pneumatic Components:</label>
              <div class="rating-container">
                <input type="radio" id="subskill6Rating1" name="subskill6" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill6Rating2" name="subskill6" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill6Rating3" name="subskill6" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill6Rating4" name="subskill6" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill6Rating5" name="subskill6" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
            </div>
           
            <div class="${styles.formGroup}" id="subskill7">
              <label>Knowledge of Selecting Components for the Process:</label>
              <div class="rating-container">
                <input type="radio" id="subskill7Rating1" name="subskill7" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill7Rating2" name="subskill7" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill7Rating3" name="subskill7" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill7Rating4" name="subskill7" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill7Rating5" name="subskill7" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
            </div>

            </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 2 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 20%;"></div>
              </div>
            </div>
            </br>

            </div>
          <div>



          <div id="paintSkills" style="display: none;">
              <h2>Paint Skills</h2>
             <div class="${styles.formGroup}">
                <label htmlFor="subskill8">Basics of paint:</label>
                <div class="rating-container" id="subskill8Rating">
                  <input type="radio" id="subskill8Rating1" name="subskill8" class="${styles.circleInput}" value="1" />  <span>1</span>
                  <input type="radio" id="subskill8Rating2" name="subskill8" class="${styles.circleInput}" value="2" />  <span>2</span>
                  <input type="radio" id="subskill8Rating3" name="subskill8" class="${styles.circleInput}" value="3" />  <span>3</span>
                  <input type="radio" id="subskill8Rating4" name="subskill8" class="${styles.circleInput}" value="4" />  <span>4</span>
                  <input type="radio" id="subskill8Rating5" name="subskill8" class="${styles.circleInput}" value="5" />  <span>5</span>
                </div>
              </div>
              <div class="${styles.formGroup}">
                <label htmlFor="subskill9">Painting process flow :</label>
                <div class="rating-container" id="subskill9Rating">
                  <input type="radio" id="subskill9Rating1" name="subskill9" class="${styles.circleInput}" value="1" /> <span>1</span>
                  <input type="radio" id="subskill9Rating2" name="subskill9" class="${styles.circleInput}" value="2" /> <span>2</span>
                  <input type="radio" id="subskill9Rating3" name="subskill9" class="${styles.circleInput}" value="3" /> <span>3</span>
                  <input type="radio" id="subskill9Rating4" name="subskill9" class="${styles.circleInput}" value="4" /> <span>4</span>
                  <input type="radio" id="subskill9Rating5" name="subskill9" class="${styles.circleInput}" value="5" /> <span>5</span>
                </div>
              </div>

            </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 3 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 30%;"></div>
              </div>
            </div>
            </br>

            
          </div>


          <div>
            <div id="ABBRobotSystem" style="display: none;">
                <h2>ABB Robot System</h2>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill10">Robot co ordinate system :</label>
                    <div class="rating-container" id="subskill10Rating">
                      <input type="radio" id="subskill10Rating1" name="subskill10" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill10Rating2" name="subskill10" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill10Rating3" name="subskill10" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill10Rating4" name="subskill10" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill10Rating5" name="subskill10" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill11">Robot tool and base calibration:</label>
                    <div class="rating-container" id="subskill11Rating">
                      <input type="radio" id="subskill11Rating1" name="subskill11" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill11Rating2" name="subskill11" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill11Rating3" name="subskill11" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill11Rating4" name="subskill11" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill11Rating5" name="subskill11" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill12">Robot axis calibration :</label>
                    <div class="rating-container" id="subskill12Rating">
                      <input type="radio" id="subskill12Rating1" name="subskill12" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill12Rating2" name="subskill12" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill12Rating3" name="subskill12" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill12Rating4" name="subskill12" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill12Rating5" name="subskill12" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill13">Robot motion parameters :</label>
                    <div class="rating-container" id="subskill13Rating">
                      <input type="radio" id="subskill13Rating1" name="subskill13" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill13Rating2" name="subskill13" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill13Rating3" name="subskill13" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill13Rating4" name="subskill13" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill13Rating5" name="subskill13" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill14">Jogging of robot in all coordinate system :</label>
                    <div class="rating-container" id="subskill14Rating">
                      <input type="radio" id="subskill14Rating1" name="subskill14" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill14Rating2" name="subskill14" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill14Rating3" name="subskill14" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill14Rating4" name="subskill14" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill14Rating5" name="subskill14" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill15">TCP creation and modification:</label>
                    <div class="rating-container" id="subskill15Rating">
                      <input type="radio" id="subskill15Rating1" name="subskill15" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill15Rating2" name="subskill15" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill15Rating3" name="subskill15" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill15Rating4" name="subskill15" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill15Rating5" name="subskill15" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill16">Basic Teaching and modifications of program :</label>
                    <div class="rating-container" id="subskill16Rating">
                      <input type="radio" id="subskill16Rating1" name="subskill16" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill16Rating2" name="subskill16" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill16Rating3" name="subskill16" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill16Rating4" name="subskill16" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill16Rating5" name="subskill16" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill17">Hands on experience in robot operations:</label>
                    <div class="rating-container" id="subskill17Rating">
                      <input type="radio" id="subskill17Rating1" name="subskill17" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill17Rating2" name="subskill17" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill17Rating3" name="subskill17" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill17Rating4" name="subskill17" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill17Rating5" name="subskill17" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill18">Troubleshooting and PM of robot control cabinet:</label>
                    <div class="rating-container" id="subskill18Rating">
                      <input type="radio" id="subskill18Rating1" name="subskill18" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill18Rating2" name="subskill18" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill18Rating3" name="subskill18" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill18Rating4" name="subskill18" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill18Rating5" name="subskill18" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill19">Troubleshooting and PM of robot Manipulator:</label>
                    <div class="rating-container" id="subskill19Rating">
                      <input type="radio" id="subskill19Rating1" name="subskill19" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill19Rating2" name="subskill19" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill19Rating3" name="subskill19" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill19Rating4" name="subskill19" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill19Rating5" name="subskill19" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill20">Knowledge on Robot studio software:</label>
                    <div class="rating-container" id="subskill20Rating">
                      <input type="radio" id="subskill20Rating1" name="subskill20" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill20Rating2" name="subskill20" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill20Rating3" name="subskill20" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill20Rating4" name="subskill20" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill20Rating5" name="subskill20" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill21">Knowledge on Shop floor editor software:</label>
                    <div class="rating-container" id="subskill21Rating">
                      <input type="radio" id="subskill21Rating1" name="subskill21" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill21Rating2" name="subskill21" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill21Rating3" name="subskill21" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill21Rating4" name="subskill21" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill21Rating5" name="subskill21" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
                  <div class="${styles.formGroup}">
                    <label htmlFor="subskill22">Knowledge on FFFTP and teraterm software:</label>
                    <div class="rating-container" id="subskill22Rating">
                      <input type="radio" id="subskill22Rating1" name="subskill22" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill22Rating2" name="subskill22" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill22Rating3" name="subskill22" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill22Rating4" name="subskill22" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill22Rating5" name="subskill22" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>

            </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 4 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 40%;"></div>
              </div>
            </div>
            </br>
            </div>
        </div>



        <div>
          <div id="ABBPaintSystem" style="display: none;">
             <h2>ABB Paint System</h2>
                <div class=${styles.formGroup}>
                  <label htmlFor="subskill23">Troubleshooting and PM of RB 1000 Applicator:</label>
                  <div class="rating-container" id="subskill23Rating">
                    <input type="radio" id="subskill23Rating1" name="subskill23" class="${styles.circleInput}" value="1" /> <span>1</span>
                    <input type="radio" id="subskill23Rating2" name="subskill23" class="${styles.circleInput}" value="2" /> <span>2</span>
                    <input type="radio" id="subskill23Rating3" name="subskill23" class="${styles.circleInput}" value="3" /> <span>3</span>
                    <input type="radio" id="subskill23Rating4" name="subskill23" class="${styles.circleInput}" value="4" /> <span>4</span>
                    <input type="radio" id="subskill23Rating5" name="subskill23" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div> 
                </div>
                <div class=${styles.formGroup}>
                  <label htmlFor="subskill24">Troubleshooting and PM of RB 031 Applicator :</label>
                  <div class="rating-container" id="subskill24Rating">
                    <input type="radio" id="subskill24Rating1" name="subskill24" class="${styles.circleInput}" value="1" /> <span>1</span>
                    <input type="radio" id="subskill24Rating2" name="subskill24" class="${styles.circleInput}" value="2" /> <span>2</span>
                    <input type="radio" id="subskill24Rating3" name="subskill24" class="${styles.circleInput}" value="3" /> <span>3</span>
                    <input type="radio" id="subskill24Rating4" name="subskill24" class="${styles.circleInput}" value="4" /> <span>4</span>
                    <input type="radio" id="subskill24Rating5" name="subskill24" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div> 
                </div>
                <div class=${styles.formGroup}>
                  <label htmlFor="subskill25">Troubleshooting and PM of RB 951 Applicator :</label>
                  <div class="rating-container" id="subskill25Rating">
                    <input type="radio" id="subskill25Rating1" name="subskill25" class="${styles.circleInput}" value="1" /> <span>1</span>
                    <input type="radio" id="subskill25Rating2" name="subskill25" class="${styles.circleInput}" value="2" /> <span>2</span>
                    <input type="radio" id="subskill25Rating3" name="subskill25" class="${styles.circleInput}" value="3" /> <span>3</span>
                    <input type="radio" id="subskill25Rating4" name="subskill25" class="${styles.circleInput}" value="4" /> <span>4</span>
                    <input type="radio" id="subskill25Rating5" name="subskill25" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div> 
                </div>
                <div class=${styles.formGroup}>
                  <label htmlFor="subskill26">Troubleshooting and PM of Flushable gear pump :</label>
                  <div class="rating-container" id="subskill26Rating">
                    <input type="radio" id="subskill26Rating1" name="subskill26" class="${styles.circleInput}" value="1" /> <span>1</span>
                    <input type="radio" id="subskill26Rating2" name="subskill26" class="${styles.circleInput}" value="2" /> <span>2</span>
                    <input type="radio" id="subskill26Rating3" name="subskill26" class="${styles.circleInput}" value="3" /> <span>3</span>
                    <input type="radio" id="subskill26Rating4" name="subskill26" class="${styles.circleInput}" value="4" /> <span>4</span>
                    <input type="radio" id="subskill26Rating5" name="subskill26" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div>
                </div>
                <div class=${styles.formGroup}>
                  <label htmlFor="subskill27">Troubleshooting and PM of CCV, PCV,2K mixer unit :</label>
                  <div class="rating-container" id="subskill27Rating">
                    <input type="radio" id="subskill27Rating1" name="subskill27" class="${styles.circleInput}" value="1" /> <span>1</span>
                    <input type="radio" id="subskill27Rating2" name="subskill27" class="${styles.circleInput}" value="2" /> <span>2</span>
                    <input type="radio" id="subskill27Rating3" name="subskill27" class="${styles.circleInput}" value="3" /> <span>3</span>
                    <input type="radio" id="subskill27Rating4" name="subskill27" class="${styles.circleInput}" value="4" /> <span>4</span>
                    <input type="radio" id="subskill27Rating5" name="subskill27" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div> 
                </div>
                </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 5 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 50%;"></div>
              </div>
            </div>
            </br>
          </div>
        </div>



        <div>
          <div id="YaskawaRobotSystem" style="display: none;">
              <h2>Yaskawa Robot System</h2>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill28">Robot co ordinate system :</label>
                    <div class="rating-container" id="subskill28Rating">
                      <input type="radio" id="subskill28Rating1" name="subskill28" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill28Rating2" name="subskill28" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill28Rating3" name="subskill28" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill28Rating4" name="subskill28" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill28Rating5" name="subskill28" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill29">Robot tool and base calibration:</label>
                    <div class="rating-container" id="subskill29Rating">
                      <input type="radio" id="subskill29Rating1" name="subskill29" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill29Rating2" name="subskill29" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill29Rating3" name="subskill29" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill29Rating4" name="subskill29" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill29Rating5" name="subskill29" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill30">Robot axis calibration :</label>
                    <div class="rating-container" id="subskill30Rating">
                      <input type="radio" id="subskill30Rating1" name="subskill30" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill30Rating2" name="subskill30" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill30Rating3" name="subskill30" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill30Rating4" name="subskill30" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill30Rating5" name="subskill30" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill31">Robot motion parameters :</label>
                    <div class="rating-container" id="subskill31Rating">
                      <input type="radio" id="subskill31Rating1" name="subskill31" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill31Rating2" name="subskill31" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill31Rating3" name="subskill31" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill31Rating4" name="subskill31" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill31Rating5" name="subskill31" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill32">Jogging of robot in all coordinate system :</label>
                    <div class="rating-container" id="subskill32Rating">
                      <input type="radio" id="subskill32Rating1" name="subskill32" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill32Rating2" name="subskill32" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill32Rating3" name="subskill32" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill32Rating4" name="subskill32" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill32Rating5" name="subskill32" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill33">TCP creation and modification:</label>
                    <div class="rating-container" id="subskill33Rating">
                      <input type="radio" id="subskill33Rating1" name="subskill33" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill33Rating2" name="subskill33" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill33Rating3" name="subskill33" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill33Rating4" name="subskill33" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill33Rating5" name="subskill33" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill34">Basic Teaching and modifications of program :</label>
                    <div class="rating-container" id="subskill34Rating">
                      <input type="radio" id="subskill34Rating1" name="subskill34" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill34Rating2" name="subskill34" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill34Rating3" name="subskill34" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill34Rating4" name="subskill34" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill34Rating5" name="subskill34" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill35">Hands on experience in robot operations:</label>
                    <div class="rating-container" id="subskill35Rating">
                      <input type="radio" id="subskill35Rating1" name="subskill35" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill35Rating2" name="subskill35" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill35Rating3" name="subskill35" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill35Rating4" name="subskill35" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill35Rating5" name="subskill35" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill36">Troubleshooting and PM of robot control cabinet:</label>
                    <div class="rating-container" id="subskill36Rating">
                      <input type="radio" id="subskill36Rating1" name="subskill36" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill36Rating2" name="subskill36" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill36Rating3" name="subskill36" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill36Rating4" name="subskill36" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill36Rating5" name="subskill36" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill37">Troubleshooting and PM of robot Manipulator:</label>
                    <div class="rating-container" id="subskill37Rating">
                      <input type="radio" id="subskill37Rating1" name="subskill37" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill37Rating2" name="subskill37" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill37Rating3" name="subskill37" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill37Rating4" name="subskill37" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill37Rating5" name="subskill37" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill38">Knowledge on MOTOSIM software :</label>
                    <div class="rating-container" id="subskill38Rating">
                      <input type="radio" id="subskill38Rating1" name="subskill38" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill38Rating2" name="subskill38" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill38Rating3" name="subskill38" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill38Rating4" name="subskill38" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill38Rating5" name="subskill38" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 6 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 60%;"></div>
              </div>
            </div>
            </br>
          </div>
        </div>


        <div id="FANUCRobotSystem" style="display: none;">
              <h2>FANUC Robot System</h2>
              <div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill39">Robot co ordinate system :</label>
                    <div class="rating-container" id="subskill39Rating">
                      <input type="radio" id="subskill39Rating1" name="subskill39" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill39Rating2" name="subskill39" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill39Rating3" name="subskill39" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill39Rating4" name="subskill39" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill39Rating5" name="subskill39" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                  <label htmlFor="subskill40">Robot tool and base calibration:</label>
                  <div class="rating-container" id="subskill40Rating">
                      <input type="radio" id="subskill40Rating1" name="subskill40" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill40Rating2" name="subskill40" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill40Rating3" name="subskill40" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill40Rating4" name="subskill40" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill40Rating5" name="subskill40" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div> 
                  </div>
                  <div class=${styles.formGroup}>
                  <label htmlFor="subskill41">Robot axis calibration :</label>
                  <div class="rating-container" id="subskill41Rating">
                      <input type="radio" id="subskill41Rating1" name="subskill41" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill41Rating2" name="subskill41" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill41Rating3" name="subskill41" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill41Rating4" name="subskill41" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill41Rating5" name="subskill41" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div>
                  </div>
                  <div class=${styles.formGroup}>
                  <label htmlFor="subskill42">Robot motion parameters :</label>
                  <div class="rating-container" id="subskill42Rating">
                      <input type="radio" id="subskill42Rating1" name="subskill42" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill42Rating2" name="subskill42" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill42Rating3" name="subskill42" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill42Rating4" name="subskill42" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill42Rating5" name="subskill42" class="${styles.circleInput}" value="5" /> <span>5</span>
                  </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill43">Jogging of robot in all coordinate system :</label>
                    <div class="rating-container" id="subskill43Rating">
                      <input type="radio" id="subskill43Rating1" name="subskill43" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill43Rating2" name="subskill43" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill43Rating3" name="subskill43" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill43Rating4" name="subskill43" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill43Rating5" name="subskill43" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill44">TCP creation and modification:</label>
                    <div class="rating-container" id="subskill44Rating">
                      <input type="radio" id="subskill44Rating1" name="subskill44" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill44Rating2" name="subskill44" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill44Rating3" name="subskill44" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill44Rating4" name="subskill44" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill44Rating5" name="subskill44" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill45">Basic Teaching and modifications of program :</label>
                    <div class="rating-container" id="subskill45Rating">
                      <input type="radio" id="subskill45Rating1" name="subskill45" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill45Rating2" name="subskill45" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill45Rating3" name="subskill45" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill45Rating4" name="subskill45" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill45Rating5" name="subskill45" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill46">Hands on experience in robot operations:</label>
                    <div class="rating-container" id="subskill46Rating">
                      <input type="radio" id="subskill46Rating1" name="subskill46" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill46Rating2" name="subskill46" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill46Rating3" name="subskill46" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill46Rating4" name="subskill46" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill46Rating5" name="subskill46" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill47">Troubleshooting and PM of robot control cabinet:</label>
                    <div class="rating-container" id="subskill47Rating">
                      <input type="radio" id="subskill47Rating1" name="subskill47" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill47Rating2" name="subskill47" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill47Rating3" name="subskill47" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill47Rating4" name="subskill47" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill47Rating5" name="subskill47" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill48">Troubleshooting and PM of robot Manipulator:</label>
                    <div class="rating-container" id="subskill48Rating">
                      <input type="radio" id="subskill48Rating1" name="subskill48" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill48Rating2" name="subskill48" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill48Rating3" name="subskill48" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill48Rating4" name="subskill48" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill48Rating5" name="subskill48" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  <div class=${styles.formGroup}>
                    <label htmlFor="subskill49">Knowledge on Roboguide software :</label>
                    <div class="rating-container" id="subskill49Rating">
                      <input type="radio" id="subskill49Rating1" name="subskill49" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill49Rating2" name="subskill49" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill49Rating3" name="subskill49" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill49Rating4" name="subskill49" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill49Rating5" name="subskill49" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
                  </div>
                  </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 7 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 70%;"></div>
              </div>
            </div>
            </br>
            </div>
        </div>




        <div id="SamesPaintSystem" style="display: none;">
          <h2>SAMES Paint System</h2>
          <div class=${styles.formGroup}>
              <label htmlFor="subskill50">Troubleshooting and PM of PPH 707 Applicator :</label>
              <div class="rating-container" id="subskill50Rating">
                <input type="radio" id="subskill50Rating1" name="subskill50" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill50Rating2" name="subskill50" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill50Rating3" name="subskill50" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill50Rating4" name="subskill50" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill50Rating5" name="subskill50" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div>
          </div>
          </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 8 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 80%;"></div>
              </div>
            </div>
            </br>
        </div>



        <div id="KAWASAKIRobotSystem" style="display: none;">
          <h2>KAWASAKI Robot System</h2>
              <div class=${styles.formGroup}>
                <label htmlFor="subskill51">Robot co ordinate system :</label>
                <div class="rating-container" id="subskill51Rating">
                      <input type="radio" id="subskill51Rating1" name="subskill51" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill51Rating2" name="subskill51" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill51Rating3" name="subskill51" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill51Rating4" name="subskill51" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill51Rating5" name="subskill51" class="${styles.circleInput}" value="5" /> <span>5</span>
                </div>
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill52">Robot tool and base calibration:</label>
                    <div class="rating-container" id="subskill52Rating">
                      <input type="radio" id="subskill52Rating1" name="subskill52" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill52Rating2" name="subskill52" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill52Rating3" name="subskill52" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill52Rating4" name="subskill52" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill52Rating5" name="subskill52" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill53">Robot axis calibration :</label>
                    <div class="rating-container" id="subskill53Rating">
                      <input type="radio" id="subskill53Rating1" name="subskill53" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill53Rating2" name="subskill53" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill53Rating3" name="subskill53" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill53Rating4" name="subskill53" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill53Rating5" name="subskill53" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill54">Robot motion parameters :</label>
                    <div class="rating-container" id="subskill54Rating">
                      <input type="radio" id="subskill54Rating1" name="subskill54" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill54Rating2" name="subskill54" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill54Rating3" name="subskill54" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill54Rating4" name="subskill54" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill54Rating5" name="subskill54" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill55">Jogging of robot in all coordinate system :</label>
                    <div class="rating-container" id="subskill55Rating">
                      <input type="radio" id="subskill55Rating1" name="subskill55" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill55Rating2" name="subskill55" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill55Rating3" name="subskill55" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill55Rating4" name="subskill55" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill55Rating5" name="subskill55" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill56">TCP creation and modification:</label>
                    <div class="rating-container" id="subskill56Rating">
                      <input type="radio" id="subskill56Rating1" name="subskill56" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill56Rating2" name="subskill56" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill56Rating3" name="subskill56" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill56Rating4" name="subskill56" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill56Rating5" name="subskill56" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div>
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill57">Basic Teaching and modifications of program :</label>
                    <div class="rating-container" id="subskill57Rating">
                      <input type="radio" id="subskill57Rating1" name="subskill57" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill57Rating2" name="subskill57" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill57Rating3" name="subskill57" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill57Rating4" name="subskill57" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill57Rating5" name="subskill57" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill58">Hands on experience in robot operations:</label>
                    <div class="rating-container" id="subskill58Rating">
                      <input type="radio" id="subskill58Rating1" name="subskill58" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill58Rating2" name="subskill58" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill58Rating3" name="subskill58" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill58Rating4" name="subskill58" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill58Rating5" name="subskill58" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill59">Troubleshooting and PM of robot control cabinet:</label>
                    <div class="rating-container" id="subskill59Rating">
                      <input type="radio" id="subskill59Rating1" name="subskill59" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill59Rating2" name="subskill59" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill59Rating3" name="subskill59" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill59Rating4" name="subskill59" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill59Rating5" name="subskill59" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
              </div>
              <div class=${styles.formGroup}>
                    <label htmlFor="subskill60">Troubleshooting and PM of robot Manipulator:</label>
                    <div class="rating-container" id="subskill60Rating">
                      <input type="radio" id="subskill60Rating1" name="subskill60" class="${styles.circleInput}" value="1" /> <span>1</span>
                      <input type="radio" id="subskill60Rating2" name="subskill60" class="${styles.circleInput}" value="2" /> <span>2</span>
                      <input type="radio" id="subskill60Rating3" name="subskill60" class="${styles.circleInput}" value="3" /> <span>3</span>
                      <input type="radio" id="subskill60Rating4" name="subskill60" class="${styles.circleInput}" value="4" /> <span>4</span>
                      <input type="radio" id="subskill60Rating5" name="subskill60" class="${styles.circleInput}" value="5" /> <span>5</span>
                    </div> 
              </div>
              </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 9 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 90%;"></div>
              </div>
            </div>
            </br>
        </div>


        <div id="KukaRobotSystem" style="display: none;">
          <h2>Kuka Robot System</h2>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill61">Robot co ordinate system :</label>
              <div class="rating-container" id="subskill61Rating">
               <input type="radio" id="subskill61Rating1" name="subskill61" class="${styles.circleInput}" value="1" /> <span>1</span>
               <input type="radio" id="subskill61Rating2" name="subskill61" class="${styles.circleInput}" value="2" /> <span>2</span>
               <input type="radio" id="subskill61Rating3" name="subskill61" class="${styles.circleInput}" value="3" /> <span>3</span>
               <input type="radio" id="subskill61Rating4" name="subskill61" class="${styles.circleInput}" value="4" /> <span>4</span>
               <input type="radio" id="subskill61Rating5" name="subskill61" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill62">Robot tool and base calibration:</label>
              <div class="rating-container" id="subskill62Rating">
                <input type="radio" id="subskill62Rating1" name="subskill62" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill62Rating2" name="subskill62" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill62Rating3" name="subskill62" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill62Rating4" name="subskill62" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill62Rating5" name="subskill62" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill63">Robot axis calibration :</label>
              <div class="rating-container" id="subskill63Rating">
               <input type="radio" id="subskill63Rating1" name="subskill63" class="${styles.circleInput}" value="1" /> <span>1</span>
               <input type="radio" id="subskill63Rating2" name="subskill63" class="${styles.circleInput}" value="2" /> <span>2</span>
               <input type="radio" id="subskill63Rating3" name="subskill63" class="${styles.circleInput}" value="3" /> <span>3</span>
               <input type="radio" id="subskill63Rating4" name="subskill63" class="${styles.circleInput}" value="4" /> <span>4</span>
               <input type="radio" id="subskill63Rating5" name="subskill63" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill64">Robot motion parameters :</label>
              <div class="rating-container" id="subskill64Rating">
                <input type="radio" id="subskill64Rating1" name="subskill64" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill64Rating2" name="subskill64" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill64Rating3" name="subskill64" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill64Rating4" name="subskill64" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill64Rating5" name="subskill64" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill65">Jogging of robot in all coordinate system :</label>
              <div class="rating-container" id="subskill65Rating">
                <input type="radio" id="subskill65Rating1" name="subskill65" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill65Rating2" name="subskill65" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill65Rating3" name="subskill65" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill65Rating4" name="subskill65" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill65Rating5" name="subskill65" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill66">TCP creation and modification:</label>
              <div class="rating-container" id="subskill66Rating">
                <input type="radio" id="subskill66Rating1" name="subskill66" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill66Rating2" name="subskill66" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill66Rating3" name="subskill66" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill66Rating4" name="subskill66" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill66Rating5" name="subskill66" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill67">Basic Teaching and modifications of program :</label>
              <div class="rating-container" id="subskill67Rating">
                <input type="radio" id="subskill67Rating1" name="subskill67" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill67Rating2" name="subskill67" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill67Rating3" name="subskill67" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill67Rating4" name="subskill67" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill67Rating5" name="subskill67" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill68">Hands on experience in robot operations:</label>
              <div class="rating-container" id="subskill68Rating">
                <input type="radio" id="subskill68Rating1" name="subskill68" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill68Rating2" name="subskill68" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill68Rating3" name="subskill68" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill68Rating4" name="subskill68" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill68Rating5" name="subskill68" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill69">Troubleshooting and PM of robot control cabinet:</label>
              <div class="rating-container" id="subskill69Rating">
                <input type="radio" id="subskill69Rating1" name="subskill69" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill69Rating2" name="subskill69" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill69Rating3" name="subskill69" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill69Rating4" name="subskill69" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill69Rating5" name="subskill69" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill70">Troubleshooting and PM of robot Manipulator:</label>
              <div class="rating-container" id="subskill70Rating">
                <input type="radio" id="subskill70Rating1" name="subskill70" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill70Rating2" name="subskill70" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill70Rating3" name="subskill70" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill70Rating4" name="subskill70" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill70Rating5" name="subskill70" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            <div class=${styles.formGroup}>
              <label htmlFor="subskill71">Knowledge on Workvisual software :</label>
              <div class="rating-container" id="subskill71Rating">
                <input type="radio" id="subskill71Rating1" name="subskill71" class="${styles.circleInput}" value="1" /> <span>1</span>
                <input type="radio" id="subskill71Rating2" name="subskill71" class="${styles.circleInput}" value="2" /> <span>2</span>
                <input type="radio" id="subskill71Rating3" name="subskill71" class="${styles.circleInput}" value="3" /> <span>3</span>
                <input type="radio" id="subskill71Rating4" name="subskill71" class="${styles.circleInput}" value="4" /> <span>4</span>
                <input type="radio" id="subskill71Rating5" name="subskill71" class="${styles.circleInput}" value="5" /> <span>5</span>
              </div> 
            </div>
            </br>
            <div style="float: right; padding-right: 30px;">
              <span>Page 10 of 10</span>
              <div style="height: 7px; width:250px; border-radius: 0.125rem; background-color: #ccc; color: #fff;">
               <div style="height: 100%; border-radius: 0.125rem; background-color: #007bff; color: #fff; width: 100%;"></div>
              </div>
            </div>
            </br>
        </div>


      <div style="display: flex; justify-content: space-between;  padding: 12px;  margin-top: 10px;">
      <button id="btnPrev" type="button" value="Previous" style="font-size: 16px;   border: none; border-radius: 5px; width: 30%; background-color: var(--buttonBackground, #4caf50); color: var(--buttonText, #fff); cursor: pointer; transition: background-color 0.3s ease; margin-top: 10px;"
        onmouseover="this.style.backgroundColor='var(--buttonHoverBackground, #e01919)';" 
        onmouseout="this.style.backgroundColor='var(--buttonBackground, #4caf50)';">
        Previous Skill
      </button>
      &nbsp;  &nbsp;
      <button id="btnNext" type="button" value="Next" style="font-size: 16px;  border: none; border-radius: 5px;  width: 30%; background-color: var(--buttonBackground, #4caf50); color: var(--buttonText, #fff); cursor: pointer; transition: background-color 0.3s ease; margin-top: 10px;"
        onmouseover="this.style.backgroundColor='var(--buttonHoverBackground, #e01919)';" 
        onmouseout="this.style.backgroundColor='var(--buttonBackground, #4caf50)';">
        Next Skill
      </button>
      &nbsp;  &nbsp; 
      <button id="btnClose" type="button"  value="Close" style="font-size: 16px; border: none; padding: 12px; border-radius: 5px; background-color: var(--buttonBackground, #4caf50); color: var(--buttonText, #fff); cursor: pointer; transition: background-color 0.3s ease; margin-top: 10px; width: 30%; padding: 12px;"
      onmouseover="this.style.backgroundColor='var(--buttonHoverBackground, #e01919)';" 
      onmouseout="this.style.backgroundColor='var(--buttonBackground, #4caf50)';">
      Close
    </button>


    </div>
    
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <button id="btnPerformanceSubmit" type="button" style="font-size: 16px; display: none; border: none; padding: 12px; border-radius: 5px; background-color: var(--buttonBackground, #4caf50); color: var(--buttonText, #fff); cursor: pointer; transition: background-color 0.3s ease; margin-top: 10px; width: 100%; padding: 12px;"
        onmouseover="this.style.backgroundColor='var(--buttonHoverBackground, #e01919)';" 
        onmouseout="this.style.backgroundColor='var(--buttonBackground, #4caf50)';">
        Submit
      </button>
    </div>
    
  </div>
        <div id="response"></div>
      </div>
    `;  
    this._bindEvents();

     this.currentUserEmail = (await this.getCurrentUserEmail()).toString(); 
  }

 
  private async getCurrentUserEmail(): Promise<string> {
    try {
        const currentUserEmailQuery = await this.context.spHttpClient
            .get(`${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser?$select=Email`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse): Promise<{ Email: string }> => {
                return response.json();
            })
            .then((jsonResponse: { Email: string }): string => {
                console.log("JSON response:", jsonResponse); // Debugging statement
                return jsonResponse.Email;
            });
        console.log("Current user email:", currentUserEmailQuery); // Debugging statement
        return currentUserEmailQuery;
    } catch (error) {
        console.error("Error fetching current user email:", error);
        return ""; // or handle the error as needed
    }
 }


  private _bindEvents(): void {
    this.domElement.querySelector('#SkillMatrixVisibility').addEventListener('click', () => { this.SkillMatrixVisibility(); });
    this.domElement.querySelector('#btnClose').addEventListener('click', () => { this.SkillMatrixVisibility(); });

    document.getElementById('btnNext').addEventListener('click', () => {
      if (this._currentSkillSection === 'electrical') {
        this._toggleSkillSection('pneumatics');
      } else if (this._currentSkillSection === 'pneumatics') {
        this._toggleSkillSection('paint');
      } else if (this._currentSkillSection === 'paint') {
        this._toggleSkillSection('ABBRobotSystem');
      } else if (this._currentSkillSection === 'ABBRobotSystem') {
        this._toggleSkillSection('ABBPaintSystem');
      } else if (this._currentSkillSection === 'ABBPaintSystem') {
        this._toggleSkillSection('YaskawaRobotSystem'); // Navigate to Yaskawa Robot System section
      } else if (this._currentSkillSection === 'YaskawaRobotSystem') { // Navigate to FANUC Robot System section
        this._toggleSkillSection('FANUCRobotSystem');
      }else if (this._currentSkillSection === 'FANUCRobotSystem') { // Navigate to Sames Robot System section
        this._toggleSkillSection('SamesPaintSystem');
      }else if (this._currentSkillSection === 'SamesPaintSystem') { // Navigate to Kawasaki Robot System section
        this._toggleSkillSection('KAWASAKIRobotSystem');
      }else if (this._currentSkillSection === 'KAWASAKIRobotSystem') { // Navigate to Kuka Robot System section
        this._toggleSkillSection('KukaRobotSystem');
      }
    });

    document.getElementById('btnPrev').addEventListener('click', () => {
      if (this._currentSkillSection === 'pneumatics') {
        this._toggleSkillSection('electrical');
      } else if (this._currentSkillSection === 'paint') {
        this._toggleSkillSection('pneumatics');
      } else if (this._currentSkillSection === 'ABBRobotSystem') {
        this._toggleSkillSection('paint');
      } else if (this._currentSkillSection === 'ABBPaintSystem') {
        this._toggleSkillSection('ABBRobotSystem');
      } else if (this._currentSkillSection === 'YaskawaRobotSystem') {
        this._toggleSkillSection('ABBPaintSystem');
      } else if (this._currentSkillSection === 'FANUCRobotSystem') { 
        this._toggleSkillSection('YaskawaRobotSystem');
      }else if (this._currentSkillSection === 'SamesPaintSystem') { 
        this._toggleSkillSection('FANUCRobotSystem');
      }else if (this._currentSkillSection === 'KAWASAKIRobotSystem') { 
        this._toggleSkillSection('SamesPaintSystem');
      }else if (this._currentSkillSection === 'KukaRobotSystem') { 
        this._toggleSkillSection('KAWASAKIRobotSystem');
      }
    });
    

     this.domElement.querySelector('#btnPerformanceSubmit').addEventListener('click', () => { this.addListItem(); });
    
    
  }
  private SkillMatrixVisibility(): void {
    var SkillMatrixForm = document.getElementById("SkillMatrixForm");
    if (SkillMatrixForm.style.display === "none") {
      SkillMatrixForm.style.display = "block";
     } else {
      SkillMatrixForm.style.display = "none";
     }
  }
  
  private async  addListItem(): Promise<void> {

    // Fetch employee's :  ' EmplId and Name ' from SharePoint list
    const web = new Web("https://cygniiautomationpvtltd.sharepoint.com/sites/HRMSPORTAL");
    const list = web.lists.getByTitle('Employee List');
    const items =  await list.items.filter(`field_4 eq '${this.currentUserEmail}'`).select('Title', 'field_1').get();

    if (items.length > 0) {
        this.userId = items[0].Title;
        this.userName = items[0].field_1;
        console.log(`UserId: ${this.userId}, UserName: ${this.userName}`);
        this.empID =  (`${this.userId} - ${this.userName}`).toString();
        
    } else {
      alert('In the Employee List, your record was not found!');
      return;
    }


    //Electrical Skills
    var subskill1Rating = ((document.querySelector('input[name="subskill1"]:checked') as HTMLInputElement)?.value) || "";
    var subskill2Rating = ((document.querySelector('input[name="subskill2"]:checked') as HTMLInputElement)?.value) || "";
    var subskill3Rating = ((document.querySelector('input[name="subskill3"]:checked') as HTMLInputElement)?.value) || "";
    var KnowSelComp = ((document.querySelector('input[name="subskill4"]:checked') as HTMLInputElement)?.value) || "";
     

    //Pneumatic Skills
    var Pneumatic1Rating = ((document.querySelector('input[name="subskill5"]:checked') as HTMLInputElement)?.value) || "";
    var Pneumatic2Rating = ((document.querySelector('input[name="subskill6"]:checked') as HTMLInputElement)?.value) || "";
    var Pneumatic3Rating = ((document.querySelector('input[name="subskill7"]:checked') as HTMLInputElement)?.value) || "";
    
    //Paint Skills
    var Paint1Rating = ((document.querySelector('input[name="subskill8"]:checked') as HTMLInputElement)?.value) || "";
    var Paint2Rating = ((document.querySelector('input[name="subskill9"]:checked') as HTMLInputElement)?.value) || "";
    
    

    //ABB Robot System
    var ABBRobot1Rating  = ((document.querySelector('input[name="subskill10"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot2Rating  = ((document.querySelector('input[name="subskill11"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot3Rating  = ((document.querySelector('input[name="subskill12"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot4Rating  = ((document.querySelector('input[name="subskill13"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot5Rating  = ((document.querySelector('input[name="subskill14"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot6Rating  = ((document.querySelector('input[name="subskill15"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot7Rating  = ((document.querySelector('input[name="subskill16"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot8Rating  = ((document.querySelector('input[name="subskill17"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot9Rating  = ((document.querySelector('input[name="subskill18"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot10Rating = ((document.querySelector('input[name="subskill19"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot11Rating = ((document.querySelector('input[name="subskill20"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot12Rating = ((document.querySelector('input[name="subskill21"]:checked') as HTMLInputElement)?.value) || "";
    var ABBRobot13Rating = ((document.querySelector('input[name="subskill22"]:checked') as HTMLInputElement)?.value) || "";
    


    //ABB Paint System
    var ABBPaint1Rating = ((document.querySelector('input[name="subskill23"]:checked') as HTMLInputElement)?.value) || "";
    var ABBPaint2Rating = ((document.querySelector('input[name="subskill24"]:checked') as HTMLInputElement)?.value) || "";
    var ABBPaint3Rating = ((document.querySelector('input[name="subskill25"]:checked') as HTMLInputElement)?.value) || "";
    var ABBPaint4Rating = ((document.querySelector('input[name="subskill26"]:checked') as HTMLInputElement)?.value) || "";
    var ABBPaint5Rating = ((document.querySelector('input[name="subskill27"]:checked') as HTMLInputElement)?.value) || "";
    


    //Yaskawa Robot System
    var YASKAWA1Rating  = ((document.querySelector('input[name="subskill28"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA2Rating  = ((document.querySelector('input[name="subskill29"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA3Rating  = ((document.querySelector('input[name="subskill30"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA4Rating  = ((document.querySelector('input[name="subskill31"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA5Rating  = ((document.querySelector('input[name="subskill32"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA6Rating  = ((document.querySelector('input[name="subskill33"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA7Rating  = ((document.querySelector('input[name="subskill34"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA8Rating  = ((document.querySelector('input[name="subskill35"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA9Rating  = ((document.querySelector('input[name="subskill36"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA10Rating = ((document.querySelector('input[name="subskill37"]:checked') as HTMLInputElement)?.value) || "";
    var YASKAWA11Rating = ((document.querySelector('input[name="subskill38"]:checked') as HTMLInputElement)?.value) || "";
    
    
    //FANUC Robot System
    var FANUC1Rating  = ((document.querySelector('input[name="subskill39"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC2Rating  = ((document.querySelector('input[name="subskill40"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC3Rating  = ((document.querySelector('input[name="subskill41"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC4Rating  = ((document.querySelector('input[name="subskill42"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC5Rating  = ((document.querySelector('input[name="subskill43"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC6Rating  = ((document.querySelector('input[name="subskill44"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC7Rating  = ((document.querySelector('input[name="subskill45"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC8Rating  = ((document.querySelector('input[name="subskill46"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC9Rating  = ((document.querySelector('input[name="subskill47"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC10Rating = ((document.querySelector('input[name="subskill48"]:checked') as HTMLInputElement)?.value) || "";
    var FANUC11Rating = ((document.querySelector('input[name="subskill49"]:checked') as HTMLInputElement)?.value) || "";
    
    //SAMES Paint System
    var SAMES1Rating = ((document.querySelector('input[name="subskill50"]:checked') as HTMLInputElement)?.value) || "";
    

    //KAWASAKI Robot System
    var KAWASAKI1Rating  = ((document.querySelector('input[name="subskill51"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI2Rating  = ((document.querySelector('input[name="subskill52"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI3Rating  = ((document.querySelector('input[name="subskill53"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI4Rating  = ((document.querySelector('input[name="subskill54"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI5Rating  = ((document.querySelector('input[name="subskill55"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI6Rating  = ((document.querySelector('input[name="subskill56"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI7Rating  = ((document.querySelector('input[name="subskill57"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI8Rating  = ((document.querySelector('input[name="subskill58"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI9Rating  = ((document.querySelector('input[name="subskill59"]:checked') as HTMLInputElement)?.value) || "";
    var KAWASAKI10Rating = ((document.querySelector('input[name="subskill60"]:checked') as HTMLInputElement)?.value) || "";
    

    //Kuka Robot System
    var KUKA1Rating  = ((document.querySelector('input[name="subskill61"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA2Rating  = ((document.querySelector('input[name="subskill62"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA3Rating  = ((document.querySelector('input[name="subskill63"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA4Rating  = ((document.querySelector('input[name="subskill64"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA5Rating  = ((document.querySelector('input[name="subskill65"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA6Rating  = ((document.querySelector('input[name="subskill66"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA7Rating  = ((document.querySelector('input[name="subskill67"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA8Rating  = ((document.querySelector('input[name="subskill68"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA9Rating  = ((document.querySelector('input[name="subskill69"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA10Rating = ((document.querySelector('input[name="subskill70"]:checked') as HTMLInputElement)?.value) || "";
    var KUKA11Rating = ((document.querySelector('input[name="subskill71"]:checked') as HTMLInputElement)?.value) || "";
    


  //  const web = new Web("https://cygniiautomationpvtltd.sharepoint.com/sites/HRMSPORTAL"); 

    web.lists.getByTitle('Skills').items.add({
      EmpID: this.empID,  
      EmailId : this.currentUserEmail,
      UnderstandingElectricalDrawing: subskill1Rating,
      KnowledgeBasicPanelWiring: subskill2Rating,
      TroubleshootFieldDevicesEplan: subskill3Rating ,
      KnowledgeSelectingcomponent: KnowSelComp,

      UnderstandingPneumaticDrawing: Pneumatic1Rating, 
      HandsOnExpInPneumaticComp: Pneumatic2Rating, 
      PneumaticKnowledgeSelectingComp: Pneumatic3Rating,

      Basicsofpaint: Paint1Rating,
      PaintingProcessFlow: Paint2Rating,

      ABBRobotCoOrdinateSystem: ABBRobot1Rating,
      ABBRobotToolBaseCalibration: ABBRobot2Rating,
      RobotAxisCalibration: ABBRobot3Rating,
      RobotMotionParameters: ABBRobot4Rating,
      JoggingRobotAllCoordinateSystem: ABBRobot5Rating,
      TCPCreationAndModification: ABBRobot6Rating,
      BasicTeachingModificationProgrm: ABBRobot7Rating,
      HandsOnExpRobotOperations: ABBRobot8Rating,
      TroubleshootPMControlCabinet: ABBRobot9Rating,
      TroublePMRobotManipulator: ABBRobot10Rating,
      KnowledgeRobotstudiosoftware: ABBRobot11Rating,
      KnowledgeShopFloorEditorSoftware: ABBRobot12Rating,
      KnowledgeFFFTPTeratermSoftware: ABBRobot13Rating,

      TroubleshootRB100Applicator: ABBPaint1Rating,
      TroubleshootRB031Applicator: ABBPaint2Rating,
      TroubleshootRB951Applicator: ABBPaint3Rating,
      TroubleshootFlushablegearpump: ABBPaint4Rating,
      TroubleshootCCVPCV2Kmixerunit: ABBPaint5Rating ,

      YASKAWARobotcoordinatesystem: YASKAWA1Rating,
      YASKAWAtoolandbasecalibration: YASKAWA2Rating,
      YASKAWARoboaxiscalibration: YASKAWA3Rating,
      YASKAWARobmotionparameter: YASKAWA4Rating,
      YASKAWAJoggingroballcoordinate: YASKAWA5Rating,
      YASKAWATCPcreationmodification: YASKAWA6Rating,
      YASKAWABasicTeachgmodificprogram: YASKAWA7Rating,
      YASKAexperrobotoperation: YASKAWA8Rating,
      YASKTroublePMcontrcabinet: YASKAWA9Rating,
      YASKTroubPMRobManipulat: YASKAWA10Rating,
      YASKKnowlMOTOSIMsoftware: YASKAWA11Rating,

      FANUCRobocoordinatesyst: FANUC1Rating,
      FANUCRobtoolbasecalibration: FANUC2Rating,
      FANUCRobaxiscalibration: FANUC3Rating,
      FANUCRobmotionparameters: FANUC4Rating,
      FANUCJogginroboallcoordinatesys: FANUC5Rating,
      FANUCTCPcreationmodification: FANUC6Rating,
      FANUCBasicTeachmodificprogram: FANUC7Rating,
      FANUCHandsexperoboperations: FANUC8Rating,
      FANUCTroublePMrobcontrcabinet: FANUC9Rating,
      FANUCTroublePMrobManipulator: FANUC10Rating,
      FANUCKnowlROBOGUIDEsoftware: FANUC11Rating,

      SAMESTroublePMPPH707Applicator: SAMES1Rating,

      KAWASAKIRobcoordinatesyst: KAWASAKI1Rating,
      KAWARobotoolbasecalibration: KAWASAKI2Rating,
      KAWASARoboaxiscalibration: KAWASAKI3Rating,
      KAWASARobmotionparameters: KAWASAKI4Rating,
      KAWAJoggiroballcoordinatesyst: KAWASAKI5Rating,
      KAWATCPcreationmodification: KAWASAKI6Rating,
      KAWABasicTeachmodifiprogram: KAWASAKI7Rating,
      KAWAHandsexperobotoperations: KAWASAKI8Rating,
      KAWATroublePMrobotcontrolcabinet: KAWASAKI9Rating,
      KAWATroublesPMrobManipulator: KAWASAKI10Rating,

      KUKARobcoordinatesystem: KUKA1Rating,
      KUKARobtoolbasecalibration: KUKA2Rating,
      KUKARobotaxiscalibration: KUKA3Rating,
      KUKARobomotionparameters: KUKA4Rating,
      KUKAJoggiroboallcoordinatesys: KUKA5Rating,
      KUKATCPcreationmodification: KUKA6Rating,
      KUKABasicTeachmodifiprogram: KUKA7Rating,
      KUKAHandsexperrobooperation: KUKA8Rating,
      KUKATroublePMrobocontrolcabinet: KUKA9Rating,
      KUKATroublePMroboManipulator: KUKA10Rating,
      KUKAKnowlWorkvisualsoftware: KUKA11Rating

    }).then(() => {
      var result = this.empID + " : Performance Added Successfully";
      alert(result);
      this.clearForm();
    });
  }
  
  private clearForm(): void {
     
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radioButton) => {
        (radioButton as HTMLInputElement).checked = false;
    });
  }

  private _toggleSkillSection(section: string): void {
    const electricalSkills = document.getElementById('electricalSkills');
    const pneumaticsSkills = document.getElementById('pneumaticsSkills');
    const paintSkills = document.getElementById('paintSkills');
    const ABBRobotSystem = document.getElementById('ABBRobotSystem');
    const ABBPaintSystem = document.getElementById('ABBPaintSystem');
    const YaskawaRobotSystem = document.getElementById('YaskawaRobotSystem');
    const FANUCRobotSystem = document.getElementById('FANUCRobotSystem'); // New section
    const SamesPaintSystem = document.getElementById('SamesPaintSystem'); 
    const KAWASAKIRobotSystem = document.getElementById('KAWASAKIRobotSystem');
    const KukaRobotSystem = document.getElementById('KukaRobotSystem');
    const btnPerformanceSubmit = document.getElementById('btnPerformanceSubmit');
    
    if (electricalSkills && pneumaticsSkills && paintSkills && ABBRobotSystem && ABBPaintSystem && KukaRobotSystem && YaskawaRobotSystem && FANUCRobotSystem && SamesPaintSystem && KAWASAKIRobotSystem) {
      if (section === 'electrical') {
        this._currentSkillSection = 'electrical';
        electricalSkills.style.display = '';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display= 'none';
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none'; 
      } else if (section === 'pneumatics') {
        this._currentSkillSection = 'pneumatics';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = '';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display= 'none';
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none';  
      } else if (section === 'paint') {
        this._currentSkillSection = 'paint';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = '';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display= 'none';
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none';  
      } else if (section === 'ABBRobotSystem') {
        this._currentSkillSection = 'ABBRobotSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        SamesPaintSystem.style.display= 'none';
        ABBRobotSystem.style.display = '';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none'; // Hide FANUC Robot System
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none'; 
      } else if (section === 'ABBPaintSystem') {
        this._currentSkillSection = 'ABBPaintSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = ''; // Display ABB Paint System
        YaskawaRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display= 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none'; // Hide FANUC Robot System
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none'; 
      } else if (section === 'YaskawaRobotSystem') {
        this._currentSkillSection = 'YaskawaRobotSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = '';
        SamesPaintSystem.style.display= 'none'; // Display Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none'; // Hide FANUC Robot System
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none'; 
      } else if (section === 'FANUCRobotSystem') {
        this._currentSkillSection = 'FANUCRobotSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display= 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = ''; // Display FANUC Robot System 
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none'; 
      }else if (section === 'SamesPaintSystem') {
        this._currentSkillSection = 'SamesPaintSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display = '';  // Display FANUC Robot System  
        KAWASAKIRobotSystem.style.display = 'none';
        KukaRobotSystem.style.display= 'none'; 
      }else if (section === 'KAWASAKIRobotSystem') {
        this._currentSkillSection = 'KAWASAKIRobotSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; // Hide Yaskawa Robot System
        FANUCRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display = 'none';  // Display FANUC Robot System  KAWASAKIRobotSystem
        KAWASAKIRobotSystem.style.display = '';
        KukaRobotSystem.style.display= 'none';   
      }else if (section === 'KukaRobotSystem') {

       
        this._currentSkillSection = 'KukaRobotSystem';
        electricalSkills.style.display = 'none';
        pneumaticsSkills.style.display = 'none';
        paintSkills.style.display = 'none';
        ABBRobotSystem.style.display = 'none';
        ABBPaintSystem.style.display = 'none';
        YaskawaRobotSystem.style.display = 'none'; 
        FANUCRobotSystem.style.display = 'none';
        SamesPaintSystem.style.display = 'none';  
        KAWASAKIRobotSystem.style.display = '';
        KukaRobotSystem.style.display = '';
        KAWASAKIRobotSystem.style.display = 'none';

      }

      if (section === 'KukaRobotSystem')
        btnPerformanceSubmit.style.display = 'Block';
      else
      btnPerformanceSubmit.style.display = 'none';

    }
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
