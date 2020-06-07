import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import { Slugs } from '../slug/SlugCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';


/**
 * Represents a specific interest, such as "Software Engineering".
 * Note that all Interests must have an associated InterestType.
 * @extends api/base.BaseSlugCollection
 * @memberOf api/interest
 */
class InterestCollection extends BaseSlugCollection {
  /**
   * Creates the Interest collection.
   */
  constructor() {
    super('Interest', new SimpleSchema({
      name: { type: String },
      slugID: { type: SimpleSchema.RegEx.Id },
      description: { type: String },
    }));
  }

  /**
   * Defines a new Interest and its associated Slug.
   * @example
   * Interests.define({ name: 'Software Engineering',
   *                    slug: 'software-engineering',
   *                    description: 'Methods for group development of large, high quality software systems',
   * });
   * @param { Object } description Object with keys name, slug, description, interestType, retired.
   * Slug must be previously undefined.
   * InterestType must be an InterestType slug or ID.
   * @throws {Meteor.Error} If the interest definition includes a defined slug or undefined interestType.
   * @returns The newly created docID.
   */
  define({
           name, slug, description, retired,
         }) {
    // Get SlugID, throw error if found.
    const slugID = Slugs.define({ name: slug, entityName: this.getType() });
    // Define the Interest and get its ID
    const interestID = this._collection.insert({
      name, description, slugID,
    });
    // Connect the Slug to this Interest
    Slugs.updateEntityID(slugID, interestID);
    return interestID;
  }

  /**
   * Update an Interest.
   * @param docID The docID to be updated.
   * @param name The new name (optional).
   * @param description The new description (optional).
   * @throws { Meteor.Error } If docID is not defined, or if interestType is not valid.
   */
  update(docID, {
    name, description,
  }) {
    this.assertDefined(docID);
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (description) {
      updateData.description = description;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the Interest.
   * @param instance The docID or slug of the entity to be removed.
   * @throws { Meteor.Error } If Interest is associated with any User, Course, Career Goal, or Opportunity.
   */
  removeIt(instance) {
    const docID = this.getID(instance);
    // Check that this interest is not referenced by any Team, Developer, or Challenge.

    // OK, clear to delete.
    super.removeIt(docID);
  }


}
