// controllers/template.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Template } from "../models/template.model.js";
import mongoose from "mongoose";

/**
 * @desc Create a new template
 * @route POST /api/templates
 */
export const createTemplate = asyncHandler(async (req, res) => {
  const { title, description, content, type = "page" } = req.body;
  const userId = req.user._id;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const template = await Template.create({
    title,
    description,
    content,
    type,
    createdBy: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, template, "Template created successfully"));
});

/**
 * @desc Get all templates created by the user
 * @route GET /api/templates
 */
export const getUserTemplates = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const templates = await Template.find({ createdBy: userId }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, templates, "Templates fetched"));
});

/**
 * @desc Get a single template by ID
 * @route GET /api/templates/:templateId
 */
export const getTemplateById = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    throw new ApiError(400, "Invalid template ID");
  }

  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  if (!template.createdBy.equals(req.user._id)) {
    throw new ApiError(403, "You do not have access to this template");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, template, "Template retrieved"));
});

/**
 * @desc Update a template
 * @route PUT /api/templates/:templateId
 */
export const updateTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const userId = req.user._id;
  const { title, description, content, type } = req.body;

  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  if (!template.createdBy.equals(userId)) {
    throw new ApiError(403, "You are not the owner of this template");
  }

  if (title) template.title = title;
  if (description) template.description = description;
  if (content) template.content = content;
  if (type) template.type = type;

  await template.save();

  return res
    .status(200)
    .json(new ApiResponse(200, template, "Template updated successfully"));
});

/**
 * @desc Delete a template
 * @route DELETE /api/templates/:templateId
 */
export const deleteTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const userId = req.user._id;

  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(404, "Template not found");
  }

  if (!template.createdBy.equals(userId)) {
    throw new ApiError(403, "You are not allowed to delete this template");
  }

  await template.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Template deleted successfully"));
});
